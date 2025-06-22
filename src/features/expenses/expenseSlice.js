import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: "",
    expenses: []
};
const expenseSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setExpenses(state, action) {
            state.expenses = action.payload;
        },
        addExpense(state, action) {
            state.expenses = [action.payload, ...state.expenses];
        },
        removeExpense(state, action) {
            state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
        }
    }
});
export const { setLoading, setExpenses, addExpense, removeExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
