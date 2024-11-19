export enum MainCategory {
  NEEDS = 'NEEDS',
  WANTS = 'WANTS',
  INVEST = 'INVEST'
}

export interface Subcategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  mainCategory: MainCategory;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  mainCategory: MainCategory;
  subcategoryId: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  totalInvested: number;
  assets: Asset[];
  icon?: string;
  history: AssetHistory[];
}

export interface Asset {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  icon?: string;
  date: string;
}

export interface AssetHistory {
  date: string;
  totalValue: number;
}

export type Budget = {
  [K in MainCategory]: {
    total: number;
    spent: number;
  }
}
