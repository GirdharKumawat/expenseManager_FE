import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/authSlice";
import expenseReducer from "../features/expenses/expenseSlice";
import groupReducer from "../features/group/groupSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,  
    expense:expenseReducer,
    group:groupReducer,
  },
});