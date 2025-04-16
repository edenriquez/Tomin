import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiProcessResponse } from '@/lib/api';

interface FinancialAnalysis {
  transactions: Array<{
    date: string;
    description: string;
    amount: number;
    category: string;
  }>;
}

const calculateDateRanges = (transactions: Array<{ date: string }>) => {
  if (!transactions.length) return [];

  // Sort dates and get the date range
  const dates = transactions.map(t => new Date(t.date));
  const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Get all months between oldest and newest date
  const ranges = [];
  const currentDate = new Date(oldestDate);
  currentDate.setDate(1); // Start from beginning of month

  while (currentDate <= newestDate) {
    const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    ranges.push({
      label: monthName,
      days: daysInMonth,
      startDate: new Date(currentDate)
    });

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Ensure at least one range is available
  if (ranges.length === 0) {
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    ranges.push({
      label: currentMonth,
      days: 30,
      startDate: new Date()
    });
  }

  return ranges;
};

export default function AnalysisResult({ data }: { data: ApiProcessResponse }) {
  const { body: { analysis } } = data;
  const { transactions } = analysis as FinancialAnalysis;

  const dateRanges = calculateDateRanges(transactions);
  
  const [activeTab, setActiveTab] = useState<'concepts' | 'categories'>('concepts');
  const [selectedRange, setSelectedRange] = useState<Date>();
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Process concepts data
  const conceptsData = transactions.reduce((acc, transaction) => {
    const key = transaction.description;
    acc[key] = (acc[key] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);

  // Process categories data
  const categoriesData = transactions.reduce((acc, txn) => {
    acc[txn.category] = Math.abs(txn.amount);
    return acc;
  }, {} as Record<string, number>);

  // Filter transactions by date range
  const filterTransactions = (items: typeof transactions) => {
    if (!selectedRange) return items;
    
    const startOfMonth = new Date(selectedRange);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    return items.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
    });
  };
  // Prepare chart data based on selection
  // TODO: move this feature to a different kind of
  // action button, works fine but main goal of thi chart would be 
  // just show spends per category
  // const getChartData = () => {
  //   const filteredTransactions = filterTransactions(
  //     activeTab === 'concepts' && selectedConcept
  //       ? transactions.filter(t => t.description === selectedConcept)
  //       : transactions.filter(t => t.category === selectedCategory)
  //   );

    
  //   return filteredTransactions.reduce((acc, transaction) => {
  //     const date = new Date(transaction.date).toLocaleDateString('en-US', {
  //       month: 'short',
  //       day: 'numeric',
  //     });
  //     acc[date] = (acc[date] || 0) + Math.abs(transaction.amount);
  //     return acc;
  //   }, {} as Record<string, number>);
  // };

  const getChartData = () => {
    const filteredTransactions = filterTransactions(transactions);

    
    return filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const category = transaction.category;
      if (!acc[date]) acc[date] = { total: 0, categories: {} };
      acc[date].total += Math.abs(transaction.amount);
      acc[date].categories[category] = (acc[date].categories[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, { total: number; categories: Record<string, number> }>);
  };

  const rawChartData = getChartData();
  const allCategories = Array.from(new Set(transactions.map(t => t.category)));
  const chartData = Object.entries(rawChartData).map(([date, data]) => ({
    date,
    ...data.categories,
    total: data.total
  }));

  return (
    <div className="bg-white text-gray-800 h-screen flex rounded-lg">
      {/* Left Sidebar (30%) */}
      <div className="w-1/3 border-r p-6 flex flex-col bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tomin</h1>
          <h2 className="text-lg text-gray-600 mt-1">AI-Powered Assistant</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          {['concepts', 'categories'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors
                ${activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab(tab as 'concepts' | 'categories')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {(activeTab === 'concepts' ? Object.entries(conceptsData) : Object.entries(categoriesData)).map(([key, amount]) => (
            <div
              key={key}
              className={`group flex items-center justify-between p-4 mb-3 rounded-xl cursor-pointer transition-all
                ${(activeTab === 'concepts' && selectedConcept === key) || 
                  (activeTab === 'categories' && selectedCategory === key)
                  ? 'bg-white border-2 border-blue-200 shadow-md'
                  : 'hover:bg-white hover:shadow-sm border border-transparent'}`}
              onClick={() => activeTab === 'concepts' 
                ? setSelectedConcept(key) 
                : setSelectedCategory(key)}
            >
              <span className={`text-sm ${
                (activeTab === 'concepts' && selectedConcept === key) ||
                (activeTab === 'categories' && selectedCategory === key)
                  ? 'font-semibold text-gray-900'
                  : 'font-medium text-gray-600'
              }`}>
                {activeTab === 'categories' ? key.replace(/_/g, ' ') : key}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {amount.toLocaleString('es', {
                  style: 'currency',
                  currency: 'MXN'
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content (70%) */}
      <div className="w-2/3 p-8 flex flex-col">
        {/* Date Range Filter */}
        <div className="flex justify-center gap-2 mb-8">
          {dateRanges.map((range) => (
            <button
              key={range.label}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors
                ${selectedRange?.getTime() === range.startDate.getTime()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setSelectedRange(range.startDate)}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Main Chart */}
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {activeTab === 'concepts' 
              ? selectedConcept || 'Select a Concept'
              : selectedCategory 
                ? `${selectedCategory.replace(/_/g, ' ')} Spending`
                : 'Select a Category'}
          </h3>
          
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}
                content={({ active, payload, label }) => active && (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="font-semibold mb-2">{label}</p>
                  {payload?.map((entry, index) => (
                    <div key={`item-${index}`} className="flex justify-between gap-4">
                      <span style={{ color: entry.color }}>
                        {typeof entry.name === 'string' ? entry.name.replace(/_/g, ' ') : 'Unknown'}:
                      </span>
                      <span>
                        {(entry.value || 0).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        })}
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-gray-100 font-semibold">
                    Total: {payload?.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
                      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                </div>
              )}
              />
              {
                allCategories.map((category, index) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={[
                      '#3B82F6',
                      '#10B981',
                      '#F59E0B',
                      '#EF4444',
                      '#8B5CF6'
                    ][index % 5]}
                    radius={index === allCategories.length - 1 ? [4, 4, 0, 0] : undefined}
                  />
                ))
              }
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}