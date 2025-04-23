import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./app/Home.jsx";
import ExpenseAnalysisPage   from "./app/ExpenseAnalysisPage.jsx";
import Signup from "@/app/Signup.jsx";
import Login from "@/app/Login.jsx";
import { Outlet } from "react-router";
import BottomNavBar from "@/components/BottomNavBar.jsx";
import HeadNavBar from "@/components/HeadNavBar.jsx";
import AddExpense from "@/app/AddExpense.jsx";
import Account from "@/app/Account.jsx";
 
/**
 * Layout with Bottom Navigation Bar
 */

function LayoutWithBottomNavBar() {
    return (
        <div className="overflow-hidden">
            <Outlet />
            <BottomNavBar />
        </div>
    );
}
function LayoutWithHeadNavBar() {
    return (
        <div className="overflow-hidden">
            <HeadNavBar />
            <Outlet />
        </div>
    );
}

/**
 * App Component
 */

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutWithHeadNavBar />}>
                    <Route element={<LayoutWithBottomNavBar />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/analysis" element={<ExpenseAnalysisPage/>} />
                    </Route>
                </Route>

                {/* Pages without Bottom Navigation Bar */}
                <Route path="/add" element={<AddExpense />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
