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
import NavigateSetter from "./setter/navigate.setter";
import CreateProfilePage from "./pages/onBroading/create-profile.page";
import OnBroadingMainPage from "./pages/onBroading/main";
import OnBoardingLayout from "./layouts/onBoarding.layout";
import PublicRoute from "./routes/public.route";
import DontHaveProfileRoute from "./routes/dont-have-profile.route";
import HaveProfileRoute from "./routes/have-profile.route";
import AdminRoute from "./routes/admin.route";
import AccessDinied from "./pages/access-denied.page";
import ProfileChecker from "./checker/profile.checker";
import { ThemeProvider } from "./provider/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <NavigateSetter />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="sign-in" element={<LoginPage />} />
              <Route path="sign-up" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Protected Routes*/}
          <Route element={<ProtectedRoute />}>
            <Route element={<ProfileChecker />}>
              {/* Don't have Profile Routes */}
              <Route element={<DontHaveProfileRoute />}>
                {/* Onboarding Route */}
                <Route path="onBoarding" element={<OnBoardingLayout />}>
                  <Route index element={<OnBroadingMainPage />} />
                  <Route
                    path="create-profile"
                    element={<CreateProfilePage />}
                  />
                </Route>
              </Route>

              {/* Have Profile Routes */}
              <Route element={<HaveProfileRoute />}>
                <Route path="dashboard" element={<DashboardLayout />}>
                  {/* User Routes */}
                  <Route index element={<DashboardPage />} />
                  <Route
                    path="transactions"
                    element={<TransactionListPage />}
                  />
                  <Route
                    path="transaction/:id"
                    element={<TransactionDetailPage />}
                  />
                  <Route path="accounts" element={<AccountPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="profile" element={<ProfilePage />} />

                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="admin" element={<AdminPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>

          {/* access dinied */}
          <Route path="access-dinied" element={<AccessDinied />} />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
