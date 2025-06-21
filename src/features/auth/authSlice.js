import { createSlice } from "@reduxjs/toolkit";

function isJWTValid(token) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return !(payload.exp && Date.now() >= payload.exp * 1000);
    } catch (e) {
        return false;
    }
}

const initialState = {
    loading: false,
    isAuthenticated: isJWTValid(localStorage.getItem("accessToken")),
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
    username: "",
    email: ""
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

        setTokens(state, action) {
            const { access, refresh } = action.payload;
            state.accessToken = access || "";
            state.refreshToken = refresh || "";
        },

        setUser(state, action) {
            const { username, email } = action.payload;
            state.username = username || "";
            state.email = email || "";
        }
    }
});

export const { setLoading, setIsAuthenticated, setTokens, setUser } = authSlice.actions;
export default authSlice.reducer;
