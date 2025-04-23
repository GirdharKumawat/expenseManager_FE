const ExpenseTable = () => {
    const expenses = [
        { id: 1, date: "2023-10-10", category: "Food", amount: 20.5, description: "Lunch at Cafe" },
        { id: 2, date: "2023-10-09", category: "Transport", amount: 10.0, description: "Bus fare" }
    ];

    return (
        <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Recent Expenses</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg bg-gray-800">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="border-b border-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-300">{expense.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    {expense.category}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    ${expense.amount}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">
                                    {expense.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseTable;
