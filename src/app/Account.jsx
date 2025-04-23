import  API_ENDPOINT from '../key.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Account() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const getRefreshToken = () => localStorage.getItem("refreshToken");
    const API = `${API_ENDPOINT}api/profile/`;
    const REFRESH_API = `${API_ENDPOINT}/api/token/refresh/`;
    const refreshAccessToken = async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(REFRESH_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (!response.ok) throw new Error("Failed to refresh token");

            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh); // Refresh Token Rotation

            return true;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            return false;
        }
    };
    const fetchUser = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUser(await response.json());
            } else if (response.status === 401) {

                // Token expired → Try refreshing
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    fetchUser(); // Retry with new token
                } else {
                    navigate('/login'); // Redirect to login if refresh fails
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
const  handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
}

    useEffect(() => {
       
       
         fetchUser();
        console.log(user)
    }
    , [token, navigate]);





   


    return (
        <div className="mx-auto max-w-md p-6 mt-10 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Account</h1>
  
        {user ? (
          <div className="space-y-3">
            <div className="p-4 border rounded-lg shadow-sm bg-green-50 border-green-100">
              <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="animate-pulse text-gray-500 text-sm">Loading user data...</div>
        )}
      </div>
    );
}

export default Account;
