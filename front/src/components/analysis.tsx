import {  LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ApiProcessResponse } from '@/lib/api';

interface FinancialAnalysis {
  category_distribution_sum: Record<string, number>;
  transactions: Array<{
    date: string;
    description: string;
    amount: number;
  }>;
  transactions_by_category: Record<string, Array<{
    date: string;
    description: string;
    amount: number;
  }>>;
}


export default function AnalysisResult({ data }: { data: ApiProcessResponse }) {
  const { category_distribution_sum, transactions } = data.body.analysis as FinancialAnalysis;

  // Process data for charts
  const processChartData = () => {
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    const categoryData = Object.entries(category_distribution_sum).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value: Math.abs(value),
      type: value < 0 ? 'expense' : 'income'
    }));

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      
      if (transaction.amount > 0) {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += Math.abs(transaction.amount);
      }
    });

    const lineData = Object.entries(monthlyData).map(([month, values]) => ({
      month,
      ...values
    }));

    return { categoryData, lineData };
  };

  const { categoryData, lineData } = processChartData();

  return (
    
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-xl space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(category_distribution_sum).map(([category, amount]) => (
          <div key={category} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 capitalize">{category.replace(/_/g, ' ')}</h3>
            <p className={`text-2xl font-semibold ${amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                signDisplay: 'exceptZero'
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Line Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={2}
                name="Expenses"
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={categoryData.sort((a, b) => b.value - a.value)}
              layout="vertical"
              margin={{ left: 30, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                type="number"
                stroke="#9CA3AF"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9CA3AF"
                width={150}
                tick={{ fill: '#E5E7EB' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: number, name: string, entry: any) => [
                  entry.payload.name
                ]}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-gray-300 capitalize">{value}</span>
                )}
              />
              <Bar dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === 'income' ? '#10B981' : '#EF4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

   

    {/* Transactions by Category */}
      <div className="space-y-6">
        {Object.entries((data.body.analysis as FinancialAnalysis).transactions_by_category).map(([category, transactions]) => (
          <div key={category} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold capitalize">
                {category.replace(/_/g, ' ')} Transactions
              </h3>
              <span className="text-sm text-gray-400">
                Total: {category_distribution_sum[category].toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  signDisplay: 'exceptZero'
                })}
              </span>
            </div>

            <div className="space-y-2">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-750 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4 w-3/5">
                    <span className="text-sm text-gray-400 w-24">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-sm truncate">
                      {transaction.description}
                    </span>
                  </div>
                  
                  <div className="w-2/5 flex items-center justify-end gap-4">
                    <span className={`text-sm ${
                      transaction.amount < 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {transaction.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        signDisplay: 'exceptZero'
                      })}
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-sm text-gray-400 capitalize">
                      {category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}