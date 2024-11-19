import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  MainCategory,
  Subcategory,
  Expense,
  AssetCategory,
  Asset,
  Budget,
} from "../types";

interface State {
  budget: Budget;
  subcategories: Subcategory[];
  expenses: Expense[];
  assetCategories: AssetCategory[];
  setBudget: (category: MainCategory, amount: number) => void;
  addSubcategory: (subcategory: Omit<Subcategory, "id" | "spent">) => void;
  updateSubcategoryBudget: (id: string, budget: number) => void;
  addExpense: (expense: Omit<Expense, "id" | "date">) => void;
  addAssetCategory: (name: string) => void;
  addAsset: (asset: Omit<Asset, "id" | "date">) => void;
  deleteSubcategory: (subcategoryId: string) => void;
  mainBudget: Record<MainCategory, { total: number }>;
  updateMainBudget: (category: MainCategory, amount: number) => void;
  addMainCategory: (category: MainCategory) => void;
}

const useStore = create<State>()(
  persist(
    (set) => ({
      budget: {
        NEEDS: { total: 0, spent: 0 },
        WANTS: { total: 0, spent: 0 },
        INVEST: { total: 0, spent: 0 },
      },
      subcategories: [],
      expenses: [],
      assetCategories: [],

      setBudget: (category, amount) =>
        set((state) => ({
          budget: {
            ...state.budget,
            [category]: { ...state.budget[category], total: amount },
          },
        })),

      addSubcategory: (subcategory) =>
        set((state) => ({
          subcategories: [
            ...state.subcategories,
            { ...subcategory, id: crypto.randomUUID(), spent: 0 },
          ],
        })),

      updateSubcategoryBudget: (id, budget) =>
        set((state) => ({
          subcategories: state.subcategories.map((sub) =>
            sub.id === id ? { ...sub, budget } : sub
          ),
        })),

      addExpense: (expense) =>
        set((state) => {
          const newExpense = {
            ...expense,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
          };

          const subcategory = state.subcategories.find(
            (s) => s.id === expense.subcategoryId
          );

          if (!subcategory) return state;

          const updatedSubcategories = state.subcategories.map((s) =>
            s.id === subcategory.id
              ? { ...s, spent: s.spent + expense.amount }
              : s
          );

          const updatedBudget = {
            ...state.budget,
            [expense.mainCategory]: {
              ...state.budget[expense.mainCategory],
              spent: state.budget[expense.mainCategory].spent + expense.amount,
            },
          };

          return {
            expenses: [...state.expenses, newExpense],
            subcategories: updatedSubcategories,
            budget: updatedBudget,
          };
        }),

      addAssetCategory: (name) =>
        set((state) => ({
          assetCategories: [
            ...state.assetCategories,
            {
              id: crypto.randomUUID(),
              name,
              totalInvested: 0,
              assets: [],
              history: [],
            },
          ],
        })),

      addAsset: (asset) =>
        set((state) => {
          const now = new Date().toISOString();
          const category = state.assetCategories.find(
            (c) => c.id === asset.categoryId
          );

          if (!category) return state;

          const newAsset = {
            ...asset,
            id: crypto.randomUUID(),
            date: now,
          };

          const newTotalInvested = category.totalInvested + asset.amount;

          const updatedHistory = [
            ...category.history,
            {
              date: now,
              totalValue: newTotalInvested,
            },
          ];

          const updatedCategories = state.assetCategories.map((c) =>
            c.id === category.id
              ? {
                  ...c,
                  totalInvested: newTotalInvested,
                  assets: [...c.assets, newAsset],
                  history: updatedHistory,
                }
              : c
          );

          return {
            assetCategories: updatedCategories,
          };
        }),

      deleteSubcategory: (subcategoryId: string) =>
        set((state) => ({
          subcategories: state.subcategories.filter(
            (sub) => sub.id !== subcategoryId
          ),
        })),

      mainBudget: {
        NEEDS: { total: 0 },
        WANTS: { total: 0 },
        INVEST: { total: 0 },
      },
      updateMainBudget: (category, amount) =>
        set((state) => ({
          mainBudget: {
            ...state.mainBudget,
            [category]: { total: amount },
          },
        })),
      addMainCategory: (category: MainCategory) =>
        set((state) => ({
          mainBudget: {
            ...state.mainBudget,
            [category]: { total: 0 }
          },
          budget: {
            ...state.budget,
            [category]: { total: 0, spent: 0 }
          }
        })),
    }),
    {
      name: "expense-tracker-storage",
    }
  )
);

export default useStore;
