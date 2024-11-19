import React, { useState } from 'react';
import { MainCategory } from '../types';
import useStore from '../store/useStore';
import Toast from './Toast';
import { formatCurrency } from '../utils/formatCurrency';

export default function ExpenseForm() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [mainCategory, setMainCategory] = useState<MainCategory>('NEEDS');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { subcategories, addExpense } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subcategory = subcategories.find((s) => s.id === subcategoryId);
    if (!subcategory) {
      setError('Please select a subcategory');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (subcategory.spent + expenseAmount > subcategory.budget) {
      setError(`This expense would exceed the subcategory budget of ${formatCurrency(subcategory.budget)}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    addExpense({
      amount: expenseAmount,
      description,
      mainCategory,
      subcategoryId,
    });

    setAmount('');
    setDescription('');
    setSubcategoryId('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value as MainCategory)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="NEEDS">Needs</option>
            <option value="WANTS">Wants</option>
            <option value="INVEST">Invest</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a subcategory</option>
            {subcategories
              .filter((s) => s.mainCategory === mainCategory)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({formatCurrency(s.budget - s.spent)} remaining)
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Expense
        </button>
      </form>
      <Toast message={error} isVisible={showToast} />
    </div>
  );
}