import React, { useState } from 'react';
import useStore from '../store/useStore';
import { PlusCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';
import { generateIconFromName } from '../utils/generateIcon';
import AssetGrowthChart from './AssetGrowthChart';
import Toast from './Toast';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F43F5E'];

export default function AssetTracker() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetAmount, setNewAssetAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const { assetCategories, addAssetCategory, addAsset } = useStore();

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Please enter a category name');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    addAssetCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim() || !newAssetAmount || !selectedCategoryId) {
      setError('Please fill in all fields');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    const Icon = generateIconFromName(newAssetName);
    
    addAsset({
      name: newAssetName.trim(),
      amount: parseFloat(newAssetAmount),
      categoryId: selectedCategoryId,
      icon: Icon.name,
    });
    
    setNewAssetName('');
    setNewAssetAmount('');
  };

  // Prepare data for pie chart
  const pieData = assetCategories.map((category) => ({
    name: category.name,
    value: category.totalInvested,
  }));

  // Prepare data for bar chart
  const barData = assetCategories.flatMap((category) =>
    category.assets.map((asset) => ({
      category: category.name,
      asset: asset.name,
      amount: asset.amount,
    }))
  );

  const totalAssets = assetCategories.reduce(
    (sum, category) => sum + category.totalInvested,
    0
  );

  return (
    <div className="space-y-8">
      <AssetGrowthChart />

      {/* Asset Distribution Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Asset Distribution</h2>
        <div className="text-center mb-4">
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(totalAssets)}
          </p>
          <p className="text-gray-600">Total Assets</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Breakdown Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Asset Breakdown</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="asset" angle={-45} textAnchor="end" height={70} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="amount" fill="#3B82F6" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Management Forms */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Assets</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Add Asset Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              <PlusCircle size={24} />
            </button>
          </form>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Add Asset</h3>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {assetCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              placeholder="Asset name"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.01"
              value={newAssetAmount}
              onChange={(e) => setNewAssetAmount(e.target.value)}
              placeholder="Amount"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add Asset
            </button>
          </form>
        </div>

        {/* Asset Categories List */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Asset Categories</h3>
          <div className="space-y-4">
            {assetCategories.map((category) => {
              const Icon = generateIconFromName(category.name);
              return (
                <div
                  key={category.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h4 className="font-semibold">{category.name}</h4>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(category.totalInvested)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {category.assets.map((asset) => {
                      const AssetIcon = asset.icon ? generateIconFromName(asset.name) : generateIconFromName('wallet');
                      return (
                        <div
                          key={asset.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <AssetIcon className="h-4 w-4" />
                            <span>{asset.name}</span>
                          </div>
                          <span>{formatCurrency(asset.amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Toast message={error} isVisible={showToast} />
    </div>
  );
}