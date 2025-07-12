import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setExpenses, setLoading, removeExpense, addExpense } from "./expenseSlice";
import axiosAPI from "../../axios";

const useExpense = () => {
    const dispatch = useDispatch();
     

    // function to fetch expenses
    const getExpenses = async () => {
        try {
            dispatch(setLoading("get"));
            const response = await axiosAPI.get("api/get/expenses/");

            if (response.status === 200) {
                const data = response.data;
                dispatch(setExpenses(data.data));
            }
        } catch (error) {
            // 401 errors are now handled automatically by axios interceptor
            toast.error("An error occurred while fetching expenses", {
                duration: 3000,
                position: "top-center"
            });
        } finally {
            dispatch(setLoading(""));
        }
    };

    // function to add an expense
    const postExpense = async (expenseData) => {
        try {
            dispatch(setLoading("add"));
            const response = await axiosAPI.post("api/add/expense/", expenseData);

            if (response.status === 201) {
                const data = response.data;
                toast.success("Expense added successfully", {
                    duration: 3000,
                    position: "top-center"
                });
                dispatch(addExpense(data.data));
            }
        } catch (error) {
            // 401 errors are now handled automatically by axios interceptor
            toast.error("An error occurred while adding the expense", {
                duration: 3000,
                position: "top-center"
            });
        } finally {
            dispatch(setLoading(""));
        }
    };

    // function to delete an expense
    const deleteExpense = async (expenseId) => {
        try {
            dispatch(setLoading("delete"));
            const response = await axiosAPI.delete(`api/delete/expense/${expenseId}/`);

            if (response.status === 204) {
                toast.success("Expense deleted successfully", {
                    duration: 3000,
                    position: "top-center"
                });
                dispatch(removeExpense(expenseId));
            }
        } catch (error) {
            // 401 errors are now handled automatically by axios interceptor
            toast.error("An error occurred while deleting the expense", {
                duration: 3000,
                position: "top-center"
            });
        } finally {
            dispatch(setLoading(""));
        }
    };

    // function to test cookie authentication
    const testCookieAuth = async () => {
        try {
            const response = await axiosAPI.get("api/auth/isauthenticated/");
            return true;
        } catch (error) {
            return false;
        }
    };

    return { getExpenses, deleteExpense, postExpense, testCookieAuth };
};

export default useExpense;
