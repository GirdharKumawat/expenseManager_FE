
import API_ENDPOINT from "../key";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const API = `${API_ENDPOINT}api/get/expenses`; 
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");


export default function ExpenseAnalysisPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("monthly"); // 'daily' or 'monthly'
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    let accessToken = getAccessToken();

    try {
      const response = await fetch(API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return fetchExpenses();
        navigate("/login");
        throw new Error("Session expired. Please log in again.");
      }

      const data = await response.json();
      setExpenses(data.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByCategory = () => {
    const categories = {};
    expenses.forEach(({ category, amount }) => {
      categories[category] = (categories[category] || 0) + parseFloat(amount);
    });
    return categories;
  };

  const groupByTime = () => {
    const timeMap = {};
    expenses.forEach(({ date, amount }) => {
      const key = new Date(date).toLocaleDateString("default", {
        month: viewMode === "monthly" ? "short" : undefined,
        day: viewMode === "daily" ? "2-digit" : undefined,
        year: "numeric",
      });
      timeMap[key] = (timeMap[key] || 0) + parseFloat(amount);
    });
    return timeMap;
  };

  if (loading) return <div className="p-6 text-center text-base">Loading analysis...</div>;

  const categoryData = groupByCategory();
  const timeData = groupByTime();

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ["#60A5FA", "#FBBF24", "#34D399", "#F87171", "#A78BFA"],
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(timeData),
    datasets: [
      {
        label: `${viewMode === "daily" ? "Daily" : "Monthly"} Expenses`,
        data: Object.values(timeData),
        backgroundColor: "#34D399",
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(timeData),
    datasets: [
      {
        label: "Expense Trend",
        data: Object.values(timeData),
        borderColor: "#3B82F6",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen space-y-8 mb-28">
      <h1 className="text-2xl font-bold text-gray-800">Expense Analysis</h1>

      <div className="flex gap-6 items-center">
        <label className="text-sm font-medium">View Mode:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-base font-semibold mb-2">Total by Category</h2>
          <Pie data={pieChartData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-base font-semibold mb-2">{viewMode === "daily" ? "Daily" : "Monthly"} Breakdown</h2>
          <Bar data={barChartData} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-base font-semibold mb-2">Expense Trend</h2>
        <Line data={lineChartData} />
      </div>
    </div>
  );
}
