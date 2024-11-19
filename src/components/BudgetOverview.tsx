import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { MainCategory } from '../types';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/formatCurrency';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6'];

export default function BudgetOverview() {
  const budget = useStore((state) => state.budget);

  const data = Object.entries(budget).map(([category, { total, spent }]) => ({
    name: category,
    value: total,
    spent,
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {Object.entries(budget).map(([category, { total, spent }], index) => (
          <div key={category} className="text-center">
            <h3 className="font-semibold">{category}</h3>
            <div className="mt-2">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{
                      width: `${Math.min((spent / total) * 100, 100)}%`,
                      backgroundColor: COLORS[index],
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                  ></div>
                </div>
              </div>
              <p className="text-sm mt-1">
                {formatCurrency(spent)} / {formatCurrency(total)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}