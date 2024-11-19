import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';
import useStore from '../store/useStore';

export default function AssetGrowthChart() {
  const assetCategories = useStore((state) => state.assetCategories);

  // If there are no asset categories or they don't have history, show a message
  if (!assetCategories?.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Asset Growth Over Time</h2>
        <p className="text-gray-500 text-center py-8">No asset data available yet. Add some assets to see their growth over time.</p>
      </div>
    );
  }

  // Prepare data for the line chart
  const allDates = new Set<string>();
  const categoryData: { [key: string]: { [date: string]: number } } = {};

  // Collect all dates and category values
  assetCategories.forEach((category) => {
    if (category?.history?.length) {
      categoryData[category.name] = {};
      category.history.forEach((record) => {
        if (record?.date) {
          allDates.add(record.date);
          categoryData[category.name][record.date] = record.totalValue;
        }
      });
    }
  });

  // If no dates were collected, show a message
  if (!allDates.size) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Asset Growth Over Time</h2>
        <p className="text-gray-500 text-center py-8">Start adding assets to track their growth over time.</p>
      </div>
    );
  }

  // Convert to chart data format
  const chartData = Array.from(allDates)
    .sort()
    .map((date) => {
      const dataPoint: any = { date: new Date(date).toLocaleDateString() };
      assetCategories.forEach((category) => {
        if (category?.name) {
          dataPoint[category.name] = categoryData[category.name]?.[date] || null;
        }
      });
      return dataPoint;
    });

  // Generate unique colors for each category
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Asset Growth Over Time</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            {assetCategories.map((category, index) => (
              category?.name && (
                <Line
                  key={category.id}
                  type="monotone"
                  dataKey={category.name}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}