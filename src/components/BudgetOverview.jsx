const BudgetOverview = () => {
    const budgets = [
        { category: "Food", spent: 150, limit: 200 },
        { category: "Transport", spent: 50, limit: 100 }
    ];

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Budget Overview</h2>
            {budgets.map((budget, index) => (
                <div key={index} className="mb-4">
                    <p className="mb-2 text-gray-300">
                        {budget.category}: ${budget.spent} / ${budget.limit}
                    </p>
                    <div className="h-2.5 w-full rounded-full bg-gray-700">
                        <div
                            className="h-2.5 rounded-full bg-blue-600"
                            style={{ width: `${(budget.spent / budget.limit) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BudgetOverview;
