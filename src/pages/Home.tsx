import React from 'react';
import BudgetOverview from '../components/BudgetOverview';
import ExpenseForm from '../components/ExpenseForm';

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <BudgetOverview />
      </div>
      <div>
        <ExpenseForm />
      </div>
    </div>
  );
}