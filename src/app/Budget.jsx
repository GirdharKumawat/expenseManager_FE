import { useState, useEffect } from "react";

const categories = [
  "Food", "Transport", "Entertainment", "Utilities",
  "Shopping", "Health", "Rent", "Other"
];

const Budget = () => {
  const [budgets, setBudgets] = useState({});

  useEffect(() => {
    // Load budgets from localStorage (you can replace this with API)
    const saved = localStorage.getItem("budgets");
    if (saved) {
      setBudgets(JSON.parse(saved));
    }
  }, []);

  const handleChange = (category, value) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage (or send to API)
    localStorage.setItem("budgets", JSON.stringify(budgets));
    alert("Budgets saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg border border-green-400">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Set Your Budgets</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <label className="text-lg font-medium text-gray-700">{category}</label>
              <input
                type="number"
                placeholder="Enter budget"
                className="w-40 rounded-lg border border-gray-300 p-2 text-right focus:outline-none focus:ring-2 focus:ring-green-300"
                value={budgets[category] || ""}
                onChange={(e) => handleChange(category, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="mt-6 w-full rounded-lg bg-green-500 px-4 py-2 text-white font-semibold shadow hover:bg-green-600 transition"
        >
          Save Budgets
        </button>
      </div>
    </div>
  );
};

export default Budget;
