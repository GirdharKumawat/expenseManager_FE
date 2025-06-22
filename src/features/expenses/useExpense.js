import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import API_ENDPOINT from "../../key";
import { useAuth } from "../auth/useAuth";
import { setExpenses, setLoading, removeExpense, addExpense } from "./expenseSlice";

const useExpense = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { accessToken } = useSelector((state) => state.auth);

    const { refreshUser, logoutUser } = useAuth();

    // function to fetch expenses
    const getExpenses = async () => {
        try {
            dispatch(setLoading("get"));
            const response = await fetch(`${API_ENDPOINT}api/get/expenses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            // Check if the response is successful

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            if (response.status === 200) {
                const data = await response.json();
                dispatch(setExpenses(data.data));
            } else if (response.status === 401) {
                const refreshed = await refreshUser();
                if (refreshed) {
                    getExpenses();
                } else {
                    logoutUser();
                    toast.error("Session expired. Please log in again.", {
                        duration: 3000,
                        position: "top-center"
                    });
                    navigate("/login");
                }
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
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
            const response = await fetch(`${API_ENDPOINT}api/add/expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(expenseData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            if (response.status === 201) {
                const data = await response.json();
                toast.success("Expense added successfully", {
                    duration: 3000,
                    position: "top-center"
                });
                dispatch(addExpense(data.data));
            } else if (response.status === 401) {
                const refreshed = await refreshUser();
                if (refreshed) {
                    postExpense(expenseData);
                } else {
                    logoutUser();
                    toast.error("Session expired. Please log in again.", {
                        duration: 3000,
                        position: "top-center"
                    });
                    navigate("/login");
                }
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
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
            const response = await fetch(`${API_ENDPOINT}api/delete/expense/${expenseId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            if (response.status === 204) {
                toast.success("Expense deleted successfully", {
                    duration: 3000,
                    position: "top-center"
                });
                dispatch(removeExpense(expenseId));
            } else if (response.status === 401) {
                const refreshed = await refreshUser();
                if (refreshed) {
                    deleteExpense(expenseId);
                } else {
                    logoutUser();
                    toast.error("Session expired. Please log in again.", {
                        duration: 3000,
                        position: "top-center"
                    });
                    navigate("/login");
                }
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the expense", {
                duration: 3000,
                position: "top-center"
            });
        } finally {
            dispatch(setLoading(""));
        }
    };

    return { getExpenses, deleteExpense, postExpense };
};

export default useExpense;
