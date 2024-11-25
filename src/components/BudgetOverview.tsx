import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MainCategory } from '../types';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/formatCurrency';
import { PieChart as PieChartIcon } from 'lucide-react';

// Bold, vibrant colors for neobrutalism
const COLORS = ['#FF3366', '#FFDE00', '#33FF57'];

export default function BudgetOverview() {
  const budget = useStore((state) => state.budget);

  const data = Object.entries(budget).map(([category, { total, spent }]) => ({
    name: category,
    value: total,
    spent,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, spent } = payload[0].payload;
      return (
        <div className="neo-card !p-3 !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-w-[200px]">
          <p className="font-bold border-b-2 border-black mb-2">{name}</p>
          <p className="font-bold">Budget: {formatCurrency(value)}</p>
          <p className="font-bold">Spent: {formatCurrency(spent)}</p>
          <p className="font-bold">
            Remaining: {formatCurrency(value - spent)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="neo-card">
      <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
        <PieChartIcon className="h-8 w-8" />
        <h2 className="text-2xl font-bold">Budget Overview</h2>
      </div>

      <div className="h-[300px] p-4 border-4 border-black rounded-lg bg-white mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              stroke="#000000"
              strokeWidth={2}
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index]} 
                  stroke="#000000"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontWeight: 'bold',
                paddingTop: '20px'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(budget).map(([category, { total, spent }], index) => {
          const percentage = Math.min((spent / total) * 100, 100);
          const isOverBudget = spent > total;
          
          return (
            <div 
              key={category} 
              className="neo-card !p-4 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: COLORS[index] + '20' }}
            >
              <h3 className="font-bold text-lg mb-2">{category}</h3>
              <div className="space-y-2">
                <div className="relative pt-1">
                  <div className="h-4 border-2 border-black rounded bg-white overflow-hidden">
                    <div
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index],
                      }}
                      className="h-full transition-all duration-300 border-r-2 border-black"
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">
                    {Math.round(percentage)}%
                  </span>
                  <span className={`font-bold text-sm ${isOverBudget ? 'text-[#FF3366]' : ''}`}>
                    {formatCurrency(spent)} / {formatCurrency(total)}
                  </span>
                </div>
                {isOverBudget && (
                  <div className="bg-[#FF3366] text-white p-2 border-2 border-black rounded text-center text-sm font-bold">
                    Over Budget!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}