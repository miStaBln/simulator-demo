
export interface TimeSeriesItem {
  date: string;
  indexLevel: number;
  divisor: number;
  referenceIndexLevel?: number;
  referenceDivisor?: number;
}

export interface DailyReturn {
  date: string;
  dailyReturn: number;
  isPositive: boolean;
}

export interface VolatilityData {
  date: string;
  volatility: number;
}

export interface UnderwaterData {
  date: string;
  drawdown: number;
}

export interface HistogramBin {
  range: string;
  count: number;
  percentage: number;
  midpoint: number;
}

export interface KeyFigures {
  startLevel: number;
  endLevel: number;
  startDate: string;
  endDate: string;
  totalReturn: number;
  numberOfDays: number;
  maxDrawdown: number;
}

export interface Stats {
  mean: number;
  stdDev: number;
}

export const calculateDailyReturns = (timeSeriesData: TimeSeriesItem[]): DailyReturn[] => {
  return timeSeriesData.slice(1).map((current, index) => {
    const previous = timeSeriesData[index];
    const dailyReturn = ((current.indexLevel / previous.indexLevel) - 1) * 100;
    return {
      date: current.date,
      dailyReturn: dailyReturn,
      isPositive: dailyReturn >= 0
    };
  });
};

export const calculateRollingVolatility = (dailyReturnsData: DailyReturn[]): VolatilityData[] => {
  return dailyReturnsData.map((_, index) => {
    if (index < 20) return null; // Need at least 21 data points
    
    const windowReturns = dailyReturnsData.slice(index - 20, index + 1).map(d => d.dailyReturn);
    const mean = windowReturns.reduce((sum, val) => sum + val, 0) / windowReturns.length;
    const variance = windowReturns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (windowReturns.length - 1);
    const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility in %
    
    return {
      date: dailyReturnsData[index].date,
      volatility: volatility
    };
  }).filter(item => item !== null) as VolatilityData[];
};

export const calculateUnderwaterPlot = (timeSeriesData: TimeSeriesItem[]): UnderwaterData[] => {
  if (timeSeriesData.length === 0) return [];
  
  let peak = timeSeriesData[0].indexLevel;
  
  return timeSeriesData.map((item) => {
    const currentLevel = item.indexLevel;
    
    if (currentLevel > peak) {
      peak = currentLevel;
    }
    
    const drawdown = ((currentLevel - peak) / peak) * 100;
    
    return {
      date: item.date,
      drawdown: drawdown
    };
  });
};

export const calculateMaxDrawdown = (timeSeriesData: TimeSeriesItem[]): number => {
  if (timeSeriesData.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = timeSeriesData[0].indexLevel;
  
  for (let i = 1; i < timeSeriesData.length; i++) {
    const currentLevel = timeSeriesData[i].indexLevel;
    
    if (currentLevel > peak) {
      peak = currentLevel;
    }
    
    const drawdown = ((peak - currentLevel) / peak) * 100;
    
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
};

export const calculateYAxisDomain = (data: number[], padding: number = 0.05): [number, number] => {
  if (data.length === 0) return [0, 100];
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const paddingAmount = range * padding;
  
  const minWithPadding = min - paddingAmount;
  const maxWithPadding = max + paddingAmount;
  
  if (max > 1) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(range)) - 1);
    return [
      Math.floor(minWithPadding / magnitude) * magnitude,
      Math.ceil(maxWithPadding / magnitude) * magnitude
    ];
  }
  
  return [
    Math.floor(minWithPadding * 1000) / 1000,
    Math.ceil(maxWithPadding * 1000) / 1000
  ];
};

export const createHistogramData = (dailyReturnsData: DailyReturn[]): HistogramBin[] => {
  if (dailyReturnsData.length === 0) return [];
  
  const returns = dailyReturnsData.map(d => d.dailyReturn);
  const min = Math.min(...returns);
  const max = Math.max(...returns);
  const numBins = 15;
  const binWidth = (max - min) / numBins;
  
  const bins = Array.from({ length: numBins }, (_, i) => ({
    binStart: min + i * binWidth,
    binEnd: min + (i + 1) * binWidth,
    count: 0,
    percentage: 0
  }));
  
  returns.forEach(returnValue => {
    const binIndex = Math.min(Math.floor((returnValue - min) / binWidth), numBins - 1);
    bins[binIndex].count++;
  });
  
  bins.forEach(bin => {
    bin.percentage = (bin.count / returns.length) * 100;
  });
  
  return bins.map(bin => ({
    range: `${bin.binStart.toFixed(1)}%`,
    count: bin.count,
    percentage: bin.percentage,
    midpoint: (bin.binStart + bin.binEnd) / 2
  }));
};

export const calculateStats = (dailyReturnsData: DailyReturn[]): Stats => {
  if (dailyReturnsData.length === 0) return { mean: 0, stdDev: 0 };
  
  const returns = dailyReturnsData.map(d => d.dailyReturn);
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  return { mean, stdDev };
};

export const calculateKeyFigures = (timeSeriesData: TimeSeriesItem[], maxDrawdown: number): KeyFigures | null => {
  if (timeSeriesData.length === 0) return null;
  
  return {
    startLevel: timeSeriesData[0].indexLevel,
    endLevel: timeSeriesData[timeSeriesData.length - 1].indexLevel,
    startDate: timeSeriesData[0].date,
    endDate: timeSeriesData[timeSeriesData.length - 1].date,
    totalReturn: ((timeSeriesData[timeSeriesData.length - 1].indexLevel / timeSeriesData[0].indexLevel) - 1) * 100,
    numberOfDays: timeSeriesData.length,
    maxDrawdown: maxDrawdown
  };
};
