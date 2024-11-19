import React, { useState } from "react";
import { MainCategory } from "../types";
import useStore from "../store/useStore";
import Toast from "./Toast";

export default function SubcategoryManager() {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory>(
    MainCategory.NEEDS
  );
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const {
    subcategories,
    budget: mainBudget,
    addSubcategory,
    updateSubcategoryBudget,
    deleteSubcategory,
  } = useStore();

  const showError = (errorMessage: string) => {
    setError(errorMessage);
    setShowToast(true);
    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();

    const budgetAmount = parseFloat(budget);
    const currentCategoryBudget = mainBudget[mainCategory].total;
    const existingSubcategoriesBudget = subcategories
      .filter((s) => s.mainCategory === mainCategory)
      .reduce((sum, sub) => sum + sub.budget, 0);

    if (existingSubcategoriesBudget + budgetAmount > currentCategoryBudget) {
      showError(
        `Total subcategory budgets cannot exceed ${mainCategory} budget of $${currentCategoryBudget}`
      );
      return;
    }

    addSubcategory({
      name: name.trim(),
      budget: budgetAmount,
      mainCategory,
    });

    setName("");
    setBudget("");
  };

  const handleUpdateBudget = (subcategoryId: string, newBudget: number) => {
    const subcategory = subcategories.find((s) => s.id === subcategoryId);
    if (!subcategory) return;

    const otherSubcategoriesBudget = subcategories
      .filter(
        (s) =>
          s.mainCategory === subcategory.mainCategory && s.id !== subcategoryId
      )
      .reduce((sum, sub) => sum + sub.budget, 0);

    if (
      otherSubcategoriesBudget + newBudget >
      mainBudget[subcategory.mainCategory].total
    ) {
      showError(
        `Total subcategory budgets cannot exceed ${subcategory.mainCategory} budget`
      );
      return;
    }

    updateSubcategoryBudget(subcategoryId, newBudget);
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    deleteSubcategory(subcategoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Toast message={error} isVisible={showToast} />

      <h2 className="text-2xl font-bold mb-4">Manage Subcategories</h2>

      <form onSubmit={handleAddSubcategory} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Main Category
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
            Subcategory Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Rent, Groceries"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            type="number"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Subcategory
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Subcategories</h3>
        <div className="space-y-4">
          {Object.values(MainCategory).map((category) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{category}</h4>
              <div className="space-y-2">
                {subcategories
                  .filter((sub) => sub.mainCategory === category)
                  .map((sub) => (
                    <div key={sub.id} className="flex items-center gap-4">
                      <span className="flex-1">{sub.name}</span>
                      <input
                        type="number"
                        step="0.01"
                        value={sub.budget}
                        onChange={(e) =>
                          handleUpdateBudget(sub.id, parseFloat(e.target.value))
                        }
                        className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-500">
                        Spent: ${sub.spent.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteSubcategory(sub.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
