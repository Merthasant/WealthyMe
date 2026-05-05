import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "@/layouts/auth.layout";
import LoginPage from "@/pages/auth/login.page";
import RegisterPage from "@/pages/auth/register.page";
import DashboardLayout from "./layouts/dashboard.layout";
import TransactionListPage from "./pages/dashboard/transactionList.page";
import TransactionDetailPage from "./pages/dashboard/transactionDetail.page";
import AccountPage from "./pages/dashboard/account.page";
import CategoriesPage from "./pages/dashboard/categories.page";
import ProfilePage from "./pages/dashboard/profile.page";
import ProtectedRoute from "./routes/protected.route";
import DashboardPage from "./pages/dashboard/dashboard.page";
import AdminPage from "./pages/dashboard/admin.page";
import NotFoundPage from "./pages/not-found.page";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes*/}
        <Route path="dashboard" element={<DashboardLayout />}>
          {/* User Routes */}
          <Route index element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionListPage />} />
          <Route path="transaction/:id" element={<TransactionDetailPage />} />
          <Route path="accounts" element={<AccountPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route path="admin" element={<ProtectedRoute adminOnly />}>
            <Route index element={<AdminPage />} />
          </Route>
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
