import React, { useState } from "react";
import { MainCategory } from "../types";
import useStore from "../store/useStore";
import Toast from "./Toast";

export default function MainCategoryManager() {
  const { addMainCategory } = useStore();
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showError = (errorMessage: string) => {
    setError(errorMessage);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      showError("Category name cannot be empty");
      return;
    }
    addMainCategory(newCategory.toUpperCase() as MainCategory);
    setNewCategory("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Toast message={error} isVisible={showToast} />
      
      <h2 className="text-2xl font-bold mb-4">Add New Main Category</h2>
      <form onSubmit={handleAddCategory} className="flex gap-4">
        <input
          type="text"
          className="border rounded px-3 py-1 flex-grow"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category name"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </form>
    </div>
  );
} 