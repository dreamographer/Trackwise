import React, { useState } from 'react';
import { MainCategory } from '../types';
import useStore from '../store/useStore';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function BudgetSettings() {
  const { budget, setBudget } = useStore();
  const [budgets, setBudgets] = useState({
    NEEDS: budget.NEEDS.total.toString(),
    WANTS: budget.WANTS.total.toString(),
    INVEST: budget.INVEST.total.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(budgets).forEach(([category, amount]) => {
      setBudget(category as MainCategory, parseFloat(amount) || 0);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">Budget Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.values(MainCategory).map((category) => (
          <div key={category}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {category} Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={budgets[category]}
                onChange={(e) =>
                  setBudgets((prev) => ({
                    ...prev,
                    [category]: e.target.value,
                  }))
                }
                className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Spent: {formatCurrency(budget[category].spent)}
            </p>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Update Budgets
        </button>
      </form>
    </div>
  );
}