import React, { useState } from "react";
import { MainCategory } from "../types";
import useStore from "../store/useStore";
import Toast from "./Toast";
import { formatCurrency } from "../utils/formatCurrency";

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory>(
    MainCategory.NEEDS
  );
  const [subcategoryId, setSubcategoryId] = useState("");
  const [error, setError] = useState(""); 
  const [showToast, setShowToast] = useState(false);

  const { subcategories, addExpense } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subcategory = subcategories.find((s) => s.id === subcategoryId);
    if (!subcategory) {
      setError("Please select a subcategory");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (subcategory.spent + expenseAmount > subcategory.budget) {
      setError(
        `This expense would exceed the subcategory budget of ${formatCurrency(
          subcategory.budget
        )}`
      );
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

    setAmount("");
    setDescription("");
    setSubcategoryId("");
  };

  return (
    <div className="neo-card">
      <h2 className="text-2xl font-bold mb-6 border-b-4 border-black pb-2">
        Add Expense
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="neo-input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Category
          </label>
          <select
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value as MainCategory)}
            className="neo-select w-full"
          >
            <option value="NEEDS">Needs</option>
            <option value="WANTS">Wants</option>
            <option value="INVEST">Invest</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Subcategory
          </label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="neo-select w-full"
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
          <label className="block text-sm font-bold text-black mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neo-input w-full"
          />
        </div>
        <button
          type="submit"
          className="neo-button w-full bg-[#FF3366] text-white font-bold hover:bg-[#FF1F59]"
        >
          Add Expense
        </button>
      </form>
      <Toast message={error} isVisible={showToast} />
    </div>
  );
}
