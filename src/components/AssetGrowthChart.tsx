import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/formatCurrency";
import useStore from "../store/useStore";
import { TrendingUp } from "lucide-react";

export default function AssetGrowthChart() {
  const assetCategories = useStore((state) => state.assetCategories);

  // Empty state with neobrutalism style
  if (!assetCategories?.length) {
    return (
      <div className="neo-card mb-8">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
          <TrendingUp className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Asset Growth Over Time</h2>
        </div>
        <div className="border-4 border-black rounded-lg p-8 bg-[#FFDE00]">
          <p className="text-black font-bold text-center text-lg">
            No asset data available yet. Add some assets to see their growth
            over time.
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for the line chart
  const allDates = new Set<string>();
  const categoryData: { [key: string]: { [date: string]: number } } = {};

  // Collect all dates and category values
  assetCategories.forEach((category) => {
    if (category?.history?.length) {
      categoryData[category.name] = {};
      category.history.forEach((record) => {
        if (record?.date) {
          allDates.add(record.date);
          categoryData[category.name][record.date] = record.totalValue;
        }
      });
    }
  });

  // Empty state for no history
  if (!allDates.size) {
    return (
      <div className="neo-card mb-8">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
          <TrendingUp className="h-8 w-8" />
          <h2 className="text-2xl font-bold">Asset Growth Over Time</h2>
        </div>
        <div className="border-4 border-black rounded-lg p-8 bg-[#FFDE00]">
          <p className="text-black font-bold text-center text-lg">
            Start adding assets to track their growth over time.
          </p>
        </div>
      </div>
    );
  }

  // Convert to chart data format
  const chartData = Array.from(allDates)
    .sort()
    .map((date) => {
      const dataPoint: any = { date: new Date(date).toLocaleDateString() };
      assetCategories.forEach((category) => {
        if (category?.name) {
          dataPoint[category.name] =
            categoryData[category.name]?.[date] || null;
        }
      });
      return dataPoint;
    });

  // Bold, vibrant colors for neobrutalism
  const colors = [
    "#FF3366",
    "#FFDE00",
    "#33FF57",
    "#3366FF",
    "#FF33FF",
    "#33FFFF",
  ];

  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="neo-card !p-3 !shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-w-[200px]">
          <p className="font-bold border-b-2 border-black mb-2">{`Date: ${label}`}</p>
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
    <div className="neo-card mb-8">
      <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-2">
        <TrendingUp className="h-8 w-8" />
        <h2 className="text-2xl font-bold">Asset Growth Over Time</h2>
      </div>

      <div className="h-[400px] p-4 border-4 border-black rounded-lg bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#000"
              strokeWidth={1}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#000", fontWeight: "bold" }}
              tickLine={{ stroke: "#000" }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fill: "#000", fontWeight: "bold" }}
              tickLine={{ stroke: "#000" }}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontWeight: "bold",
              }}
            />
            {assetCategories.map(
              (category, index) =>
                category?.name && (
                  <Line
                    key={category.id}
                    type="monotone"
                    dataKey={category.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      strokeWidth: 3,
                      fill: "#fff",
                      stroke: colors[index % colors.length],
                    }}
                    activeDot={{
                      r: 8,
                      strokeWidth: 3,
                      fill: "#fff",
                      stroke: colors[index % colors.length],
                    }}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
