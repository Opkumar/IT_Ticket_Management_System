import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import useAuthStore from "./store/useAuthStore";
// import SignupPage from "./pages/signupPage";
import SignupPage from "./pages/SignupPage";
import HeaderPage from "./pages/headerPage/HeaderPage";
import FooterPage from "./pages/footerPage/FooterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import VerifyPage from "./pages/verifyPage/VerifyPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TicketPage from "./pages/TicketPage";
import TrackTicketPage from "./pages/TrackTicketPage";
import HistoryTicketPage from "./pages/HistoryTicketPage";
import ITteamPage from "./pages/ITteamPage";
import AdminPage from "./pages/AdminPage";
import AssignedTicketsPage from "./pages/AssignedTicketsPage";
import AssignedRequirementsPage from "./pages/AssignedRequirementsPage";
import HistoryItTeamPage from "./pages/HistoryItTeamPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./utils/PrivateRoute";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Role-based Component Rendering
  const renderRoleComponent = useMemo(() => {
    switch (authUser?.role) {
      case "faculty":
        return <HomePage />;
      case "it-team":
        return <ITteamPage />;
      case "admin":
        return <AdminPage />;
      default:
        return (
          <div className="min-h-[calc(100vh-80px)] flex justify-center items-center h-screen bg-gray-50">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
    }
  }, [authUser]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        {authUser && <HeaderPage />}

        <Routes>
          <Route
            path="/"
            element={
              authUser ? (
                <PrivateRoute>{renderRoleComponent}</PrivateRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/:id/verify/:token" element={<VerifyPage />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />

          {/* Protected Routes */}
          <Route
            path="/create-ticket"
            element={
              <PrivateRoute>
                <TicketPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ticket/tracking"
            element={
              <PrivateRoute>
                <TrackTicketPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ticket/history"
            element={
              <PrivateRoute>
                <HistoryTicketPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ticket/assigned-ticket"
            element={
              <PrivateRoute>
                <AssignedTicketsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/Requirement/assigned-Requirement"
            element={
              <PrivateRoute>
                <AssignedRequirementsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ticket-it-team/history"
            element={
              <PrivateRoute>
                <HistoryItTeamPage />
              </PrivateRoute>
            }
          />

          <Route path="/*" element={<NotFoundPage />} />
        </Routes>

        {authUser && <FooterPage />}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
