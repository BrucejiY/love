"""
数据管理模块 - 负责数据获取、存储、更新和显示
"""
import pandas as pd
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta
from pathlib import Path
import sqlite3
import json
from typing import Dict, List, Optional, Union, Tuple
import plotly.graph_objects as go
import plotly.express as px
from dataclasses import dataclass
from enum import Enum
import logging
from tqdm import tqdm
import hashlib
import pickle
import warnings
warnings.filterwarnings('ignore')

from config.paths import RAW_DATA_DIR, PROCESSED_DATA_DIR, METADATA_DIR
from utils.logger import get_logger

logger = get_logger(__name__)

class DataFrequency(Enum):
    """数据频率枚举"""
    DAILY = "1d"
    HOURLY = "1h"
    MINUTELY_5 = "5m"
    MINUTELY_15 = "15m"
    MINUTELY_30 = "30m"
    WEEKLY = "1wk"
    MONTHLY = "1mo"

@dataclass
class DataRequest:
    """数据请求参数"""
    symbols: List[str]
    start_date: str
    end_date: str
    frequency: DataFrequency = DataFrequency.DAILY
    include_indicators: bool = True
    force_download: bool = False

class DataManager:
    """数据管理器 - 核心数据操作类"""
    
    def __init__(self, config=None):
        """初始化数据管理器"""
        self.config = config
        self.cache = {}  # 内存缓存
        self._init_database()
        logger.info("数据管理器初始化完成")
        
    def _init_database(self):
        """初始化SQLite数据库"""
        self.db_path = Path("data/quant_data.db")
        self.db_path.parent.mkdir(exist_ok=True)
        
        # 创建连接
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()
        
        # 创建数据表
        self._create_tables()
        
    def _create_tables(self):
        """创建数据库表"""
        # 股票数据表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS stock_data (
                symbol TEXT,
                date DATE,
                open REAL,
                high REAL,
                low REAL,
                close REAL,
                volume REAL,
                adj_close REAL,
                PRIMARY KEY (symbol, date)
            )
        ''')
        
        # 元数据表
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS data_metadata (
                symbol TEXT,
                last_updated TIMESTAMP,
                data_points INTEGER,
                start_date DATE,
                end_date DATE,
                frequency TEXT,
                hash_value TEXT,
                PRIMARY KEY (symbol, frequency)
            )
        ''')
        
        self.conn.commit()
        logger.debug("数据库表创建/验证完成")
    
    def fetch_stock_data(self, request: DataRequest) -> Dict[str, pd.DataFrame]:
        """
        获取股票数据 - 主要数据抓取函数
        
        Args:
            request: 数据请求参数
            
        Returns:
            字典 {symbol: DataFrame}
        """
        logger.info(f"开始获取数据: {request.symbols}")
        
        data_dict = {}
        
        for symbol in tqdm(request.symbols, desc="下载数据"):
            try:
                # 检查缓存
                cache_key = self._generate_cache_key(symbol, request)
                
                if not request.force_download and self._check_cache(cache_key):
                    logger.info(f"从缓存加载数据: {symbol}")
                    data = self._load_from_cache(cache_key)
                else:
                    # 从Yahoo Finance下载
                    logger.info(f"从Yahoo Finance下载数据: {symbol}")
                    data = self._download_from_yahoo(symbol, request)
                    
                    # 计算技术指标
                    if request.include_indicators:
                        data = self._calculate_technical_indicators(data)
                    
                    # 保存到缓存和数据库
                    self._save_data(symbol, data, request.frequency)
                    self._update_metadata(symbol, data, request.frequency)
                    self._save_to_cache(cache_key, data)
                
                data_dict[symbol] = data
                
            except Exception as e:
                logger.error(f"获取{symbol}数据失败: {str(e)}")
                continue
        
        logger.info(f"数据获取完成，成功获取{len(data_dict)}个标的")
        return data_dict
    
    def _download_from_yahoo(self, symbol: str, request: DataRequest) -> pd.DataFrame:
        """从Yahoo Finance下载数据"""
        try:
            ticker = yf.Ticker(symbol)
            
            # 下载数据
            data = ticker.history(
                start=request.start_date,
                end=request.end_date,
                interval=request.frequency.value
            )
            
            if data.empty:
                raise ValueError(f"未获取到{symbol}的数据")
            
            # 重命名列
            data.columns = [col.lower() for col in data.columns]
            
            # 添加额外信息
            data['symbol'] = symbol
            data.index.name = 'date'
            
            logger.debug(f"下载{symbol}数据成功，数据形状: {data.shape}")
            return data
            
        except Exception as e:
            logger.error(f"Yahoo Finance下载{symbol}失败: {str(e)}")
            raise
    
    def _calculate_technical_indicators(self, data: pd.DataFrame) -> pd.DataFrame:
        """计算技术指标"""
        import ta
        
        df = data.copy()
        
        # 移动平均线
        df['ma_5'] = df['close'].rolling(window=5).mean()
        df['ma_20'] = df['close'].rolling(window=20).mean()
        df['ma_60'] = df['close'].rolling(window=60).mean()
        
        # 布林带
        bb = ta.volatility.BollingerBands(df['close'], window=20, window_dev=2)
        df['bb_upper'] = bb.bollinger_hband()
        df['bb_middle'] = bb.bollinger_mavg()
        df['bb_lower'] = bb.bollinger_lband()
        
        # RSI
        df['rsi'] = ta.momentum.RSIIndicator(df['close'], window=14).rsi()
        
        # MACD
        macd = ta.trend.MACD(df['close'])
        df['macd'] = macd.macd()
        df['macd_signal'] = macd.macd_signal()
        df['macd_diff'] = macd.macd_diff()
        
        # 成交量指标
        df['volume_sma'] = df['volume'].rolling(window=20).mean()
        
        # ATR (平均真实范围)
        df['atr'] = ta.volatility.AverageTrueRange(
            high=df['high'], 
            low=df['low'], 
            close=df['close'], 
            window=14
        ).average_true_range()
        
        return df
    
    def _save_data(self, symbol: str, data: pd.DataFrame, frequency: DataFrequency):
        """保存数据到数据库"""
        try:
            # 保存到SQLite
            data_reset = data.reset_index()
            data_reset['symbol'] = symbol
            data_reset['frequency'] = frequency.value
            
            # 使用pandas的to_sql方法
            data_reset.to_sql(
                'stock_data', 
                self.conn, 
                if_exists='append', 
                index=False,
                method='multi'
            )
            
            # 同时保存为Parquet文件（用于快速读取）
            parquet_path = PROCESSED_DATA_DIR / f"{symbol}_{frequency.value}.parquet"
            data.to_parquet(parquet_path)
            
            logger.debug(f"数据已保存: {symbol} ({frequency.value})")
            
        except Exception as e:
            logger.error(f"保存数据失败: {str(e)}")
    
    def _generate_cache_key(self, symbol: str, request: DataRequest) -> str:
        """生成缓存键"""
        key_str = f"{symbol}_{request.start_date}_{request.end_date}_{request.frequency.value}"
        return hashlib.md5(key_str.encode()).hexdigest()
    
    def _check_cache(self, cache_key: str) -> bool:
        """检查缓存是否存在"""
        cache_file = METADATA_DIR / f"{cache_key}.pkl"
        return cache_file.exists()
    
    def _save_to_cache(self, cache_key: str, data: pd.DataFrame):
        """保存到磁盘缓存"""
        try:
            cache_file = METADATA_DIR / f"{cache_key}.pkl"
            with open(cache_file, 'wb') as f:
                pickle.dump(data, f)
        except Exception as e:
            logger.error(f"缓存保存失败: {str(e)}")
    
    def _load_from_cache(self, cache_key: str) -> pd.DataFrame:
        """从缓存加载"""
        try:
            cache_file = METADATA_DIR / f"{cache_key}.pkl"
            with open(cache_file, 'rb') as f:
                return pickle.load(f)
        except Exception as e:
            logger.error(f"缓存加载失败: {str(e)}")
            raise
    
    def _update_metadata(self, symbol: str, data: pd.DataFrame, frequency: DataFrequency):
        """更新元数据"""
        try:
            # 计算数据哈希
            data_hash = hashlib.md5(pd.util.hash_pandas_object(data).values).hexdigest()
            
            metadata = {
                'symbol': symbol,
                'last_updated': datetime.now().isoformat(),
                'data_points': len(data),
                'start_date': data.index.min().strftime('%Y-%m-%d'),
                'end_date': data.index.max().strftime('%Y-%m-%d'),
                'frequency': frequency.value,
                'hash_value': data_hash
            }
            
            # 保存为JSON
            meta_file = METADATA_DIR / f"{symbol}_{frequency.value}_metadata.json"
            with open(meta_file, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.debug(f"元数据已更新: {symbol}")
            
        except Exception as e:
            logger.error(f"更新元数据失败: {str(e)}")
    
    def get_available_data(self) -> pd.DataFrame:
        """获取所有可用数据的信息"""
        query = """
        SELECT 
            symbol,
            frequency,
            MIN(date) as start_date,
            MAX(date) as end_date,
            COUNT(*) as data_points,
            MAX(last_updated) as last_updated
        FROM stock_data
        LEFT JOIN data_metadata USING(symbol, frequency)
        GROUP BY symbol, frequency
        ORDER BY symbol, frequency
        """
        
        try:
            df = pd.read_sql_query(query, self.conn)
            return df
        except Exception as e:
            logger.error(f"查询可用数据失败: {str(e)}")
            return pd.DataFrame()
    
    def update_data(self, symbols: List[str], frequency: DataFrequency = DataFrequency.DAILY):
        """更新数据到最新日期"""
        logger.info(f"开始更新数据: {symbols}")
        
        # 获取每个symbol的最新日期
        for symbol in symbols:
            try:
                # 查询最新数据日期
                query = f"""
                SELECT MAX(date) as last_date 
                FROM stock_data 
                WHERE symbol = '{symbol}' AND frequency = '{frequency.value}'
                """
                result = self.cursor.execute(query).fetchone()
                
                start_date = "2020-01-01"  # 默认开始日期
                if result and result[0]:
                    # 从最后日期+1天开始
                    last_date = datetime.strptime(result[0], '%Y-%m-%d')
                    start_date = (last_date + timedelta(days=1)).strftime('%Y-%m-%d')
                
                end_date = datetime.now().strftime('%Y-%m-%d')
                
                # 如果开始日期晚于结束日期，跳过
                if start_date >= end_date:
                    logger.info(f"{symbol} 数据已是最新")
                    continue
                
                # 创建数据请求
                request = DataRequest(
                    symbols=[symbol],
                    start_date=start_date,
                    end_date=end_date,
                    frequency=frequency,
                    force_download=True
                )
                
                # 下载数据
                self.fetch_stock_data(request)
                
                logger.info(f"{symbol} 数据更新完成: {start_date} - {end_date}")
                
            except Exception as e:
                logger.error(f"更新{symbol}数据失败: {str(e)}")
    
    def delete_data(self, symbol: str, frequency: DataFrequency = None):
        """删除指定数据"""
        try:
            if frequency:
                # 删除特定频率的数据
                self.cursor.execute(
                    "DELETE FROM stock_data WHERE symbol = ? AND frequency = ?",
                    (symbol, frequency.value)
                )
                logger.info(f"已删除数据: {symbol} ({frequency.value})")
            else:
                # 删除该symbol所有数据
                self.cursor.execute(
                    "DELETE FROM stock_data WHERE symbol = ?",
                    (symbol,)
                )
                logger.info(f"已删除所有{symbol}的数据")
            
            self.conn.commit()
            
        except Exception as e:
            logger.error(f"删除数据失败: {str(e)}")
            self.conn.rollback()
    
    def export_data(self, symbol: str, format: str = 'csv', frequency: DataFrequency = None):
        """导出数据到文件"""
        try:
            # 构建查询
            if frequency:
                query = f"""
                SELECT * FROM stock_data 
                WHERE symbol = '{symbol}' AND frequency = '{frequency.value}'
                ORDER BY date
                """
            else:
                query = f"""
                SELECT * FROM stock_data 
                WHERE symbol = '{symbol}'
                ORDER BY date
                """
            
            df = pd.read_sql_query(query, self.conn)
            
            # 导出到文件
            export_dir = Path("exports")
            export_dir.mkdir(exist_ok=True)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            if format.lower() == 'csv':
                file_path = export_dir / f"{symbol}_{timestamp}.csv"
                df.to_csv(file_path, index=False)
            elif format.lower() == 'parquet':
                file_path = export_dir / f"{symbol}_{timestamp}.parquet"
                df.to_parquet(file_path)
            elif format.lower() == 'excel':
                file_path = export_dir / f"{symbol}_{timestamp}.xlsx"
                df.to_excel(file_path, index=False)
            else:
                raise ValueError(f"不支持的格式: {format}")
            
            logger.info(f"数据已导出: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"导出数据失败: {str(e)}")
            raise
    
    def close(self):
        """关闭数据库连接"""
        if hasattr(self, 'conn'):
            self.conn.close()
            logger.info("数据库连接已关闭")

# 工具函数
def create_data_request(symbols: Union[str, List[str]], 
                       start_date: str = "2020-01-01",
                       end_date: str = None,
                       frequency: str = "1d",
                       include_indicators: bool = True) -> DataRequest:
    """
    创建数据请求的便捷函数
    
    Args:
        symbols: 股票代码或列表
        start_date: 开始日期
        end_date: 结束日期（默认今天）
        frequency: 数据频率
        include_indicators: 是否包含技术指标
        
    Returns:
        DataRequest对象
    """
    if end_date is None:
        end_date = datetime.now().strftime("%Y-%m-%d")
    
    if isinstance(symbols, str):
        symbols = [symbols]
    
    # 转换频率字符串为枚举
    freq_map = {
        "1d": DataFrequency.DAILY,
        "1h": DataFrequency.HOURLY,
        "5m": DataFrequency.MINUTELY_5,
        "15m": DataFrequency.MINUTELY_15,
        "30m": DataFrequency.MINUTELY_30,
        "1wk": DataFrequency.WEEKLY,
        "1mo": DataFrequency.MONTHLY,
    }
    
    frequency_enum = freq_map.get(frequency, DataFrequency.DAILY)
    
    return DataRequest(
        symbols=symbols,
        start_date=start_date,
        end_date=end_date,
        frequency=frequency_enum,
        include_indicators=include_indicators
    )
