
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndexItem } from '@/contexts/StarredContext';
import { TrendingUp, TrendingDown, Calendar, Percent, DollarSign, BarChart3 } from 'lucide-react';

interface IndexKeyFiguresProps {
  indexData: IndexItem & {
    status: string;
    startDate: string;
    assetClass: string;
    indexType: string;
    region: string;
  };
}

const IndexKeyFigures: React.FC<IndexKeyFiguresProps> = ({ indexData }) => {
  // Sample KPI data
  const kpis = {
    ytdPerformance: 12.45,
    dividendYield: 2.8,
    yearPerformance: 18.67,
    volatility: 15.2,
    sharpeRatio: 1.23,
    maxDrawdown: -8.5,
    marketCap: 2.4,
    peRatio: 16.8,
    pbRatio: 2.1,
    constituents: 25,
    topSectorWeight: 22.5,
    topSector: 'Technology'
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(1)}T`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Index Key Figures - {indexData.name}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">YTD Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {formatPercentage(kpis.ytdPerformance)}
                </span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">1-Year Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {formatPercentage(kpis.yearPerformance)}
                </span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Dividend Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPercentage(kpis.dividendYield)}
                </span>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Volatility (1Y)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">
                  {formatPercentage(kpis.volatility)}
                </span>
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sharpe Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  {kpis.sharpeRatio.toFixed(2)}
                </span>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Max Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-red-600">
                  {formatPercentage(kpis.maxDrawdown)}
                </span>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          {/* Valuation Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {formatCurrency(kpis.marketCap)}
                </span>
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">P/E Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {kpis.peRatio.toFixed(1)}x
                </span>
                <Percent className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">P/B Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {kpis.pbRatio.toFixed(1)}x
                </span>
                <Percent className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          {/* Index Composition */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Number of Constituents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-teal-600">
                  {kpis.constituents}
                </span>
                <BarChart3 className="h-5 w-5 text-teal-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-gray-800">
                  {kpis.topSector}
                </div>
                <div className="text-sm text-gray-600">
                  {formatPercentage(kpis.topSectorWeight)} weight
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Index Currency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">
                  {indexData.currency}
                </span>
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Index Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium">{indexData.status}</span>
            </div>
            <div>
              <span className="text-gray-600">Asset Class:</span>
              <span className="ml-2 font-medium">{indexData.assetClass}</span>
            </div>
            <div>
              <span className="text-gray-600">Index Type:</span>
              <span className="ml-2 font-medium">{indexData.indexType}</span>
            </div>
            <div>
              <span className="text-gray-600">Region:</span>
              <span className="ml-2 font-medium">{indexData.region}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexKeyFigures;
