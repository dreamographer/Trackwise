import BudgetSettings from '../components/BudgetSettings';
import SubcategoryManager from '../components/SubcategoryManager';
import MainCategoryManager from '../components/MainCategoryManager';

export default function Settings() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <MainCategoryManager />
        <BudgetSettings />
      </div>
      <div>
        <SubcategoryManager />
      </div>
    </div>
  );
}