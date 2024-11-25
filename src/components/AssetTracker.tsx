import React, { useState } from 'react';
import useStore from '../store/useStore';
import { PlusCircle, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';
import { generateIconFromName } from '../utils/generateIcon';
import AssetGrowthChart from './AssetGrowthChart';
import Toast from './Toast';

// Bold, vibrant colors for neobrutalism
const COLORS = ['#FF3366', '#FFDE00', '#33FF57', '#3366FF', '#FF33FF', '#33FFFF', '#FF6B33', '#33FFB8'];

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="neo-card !p-3 !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-w-[200px]">
          <p className="font-bold border-b-2 border-black mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-bold" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <AssetGrowthChart />

      {/* Asset Distribution Overview */}
      <div className="neo-card">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
          <Wallet className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Asset Distribution</h2>
        </div>
        <div className="text-center mb-4 p-4 border-4 border-black rounded-lg bg-[#FFDE00]">
          <p className="text-3xl font-bold">
            {formatCurrency(totalAssets)}
          </p>
          <p className="font-bold">Total Assets</p>
        </div>
        <div className="h-[300px] p-4 border-4 border-black rounded-lg bg-white">
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
                strokeWidth={2}
                stroke="#000"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontWeight: 'bold' }} />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Breakdown Chart */}
      <div className="neo-card">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
          <BarChart className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Asset Breakdown</h2>
        </div>
        <div className="h-[400px] p-4 border-4 border-black rounded-lg bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeWidth={1} />
              <XAxis 
                dataKey="asset" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tick={{ fill: '#000', fontWeight: 'bold' }}
                tickLine={{ stroke: '#000' }}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fill: '#000', fontWeight: 'bold' }}
                tickLine={{ stroke: '#000' }}
                axisLine={{ stroke: '#000', strokeWidth: 2 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontWeight: 'bold' }} />
              <Bar dataKey="amount" fill="#FF3366" stroke="#000" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Management Forms */}
      <div className="neo-card">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
          <PlusCircle className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Manage Assets</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Add Asset Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="neo-input flex-1"
            />
            <button type="submit" className="neo-button bg-[#FF3366] text-white">
              <PlusCircle size={24} />
            </button>
          </form>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Add Asset</h3>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="neo-select w-full"
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
              className="neo-input w-full"
            />
            <input
              type="number"
              step="0.01"
              value={newAssetAmount}
              onChange={(e) => setNewAssetAmount(e.target.value)}
              placeholder="Amount"
              className="neo-input w-full"
            />
            <button
              type="submit"
              className="neo-button w-full bg-[#FF3366] text-white font-bold hover:bg-[#FF1F59]"
            >
              Add Asset
            </button>
          </form>
        </div>

        {/* Asset Categories List */}
        <div>
          <h3 className="text-lg font-bold mb-2">Asset Categories</h3>
          <div className="space-y-4">
            {assetCategories.map((category, index) => {
              const Icon = generateIconFromName(category.name);
              return (
                <div
                  key={category.id}
                  className="neo-card !p-4 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
                  style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h4 className="font-bold">{category.name}</h4>
                    </div>
                    <span className="font-bold bg-white px-2 py-1 border-2 border-black rounded">
                      {formatCurrency(category.totalInvested)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {category.assets.map((asset) => {
                      const AssetIcon = asset.icon ? generateIconFromName(asset.name) : generateIconFromName('wallet');
                      return (
                        <div
                          key={asset.id}
                          className="flex justify-between items-center bg-white p-2 border-2 border-black rounded"
                        >
                          <div className="flex items-center gap-2">
                            <AssetIcon className="h-4 w-4" />
                            <span className="font-bold">{asset.name}</span>
                          </div>
                          <span className="font-bold">{formatCurrency(asset.amount)}</span>
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