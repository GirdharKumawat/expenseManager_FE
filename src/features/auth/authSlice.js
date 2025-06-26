import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../axios";

// Create an async thunk for checking authentication
export const checkAuthentication = createAsyncThunk(
    'auth/checkAuthentication',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosAPI.get("api/auth/isauthenticated/");
            return true;
        } catch (err) {
            console.error("Auth check failed", err.response?.data);
            return rejectWithValue(false);
        }
    }
);

const initialState = {
    loading: false,
    isAuthenticated: false, // Initialize with a serializable value
    id: null,
    username: "",
    email: "",     
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },

        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },

        setUser(state, action) {
            const { id, username, email } = action.payload;
            if (id !== undefined) state.id = id;
            if (username !== undefined) state.username = username;
            if (email !== undefined) state.email = email;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthentication.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthentication.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload;
            })
            .addCase(checkAuthentication.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
            });
    }
});

export const { setLoading, setIsAuthenticated,  setUser} = authSlice.actions;
export default authSlice.reducer;
