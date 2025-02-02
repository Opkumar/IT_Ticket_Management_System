import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./components/Main/Login.jsx";
import SignUp from "./components/Main/SignUp.jsx";
import Home from "./components/Main/Home.jsx";
import Ticket from "./components/Main/Ticket.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { auth, db } from "./components/config/firebaseConfig.js"; // Ensure firebaseConfig.js exports `db`
import VerifyEmail from "./components/VerifyEmail.jsx";
import PrivateRoute from "./firebase/PrivateRoute.jsx";
import Admin from "./components/Main/Admin.jsx";
import ITteam from "./components/Main/ITteam.jsx";
import { ref, get } from "firebase/database"; // Import Realtime Database utilities
import AssignedTickets from "./components/Main/Assigned.Ticket.jsx";
import IT_Admin_Executive from "./components/Main/IT_Admin_Executive.jsx";
import TrackTicket from "./components/Main/trackTicket.jsx";
import HistoryTicket from "./components/Main/historyTicket.jsx";
import HistoryItTeam from "./components/Main/HistoryItTeam.jsx";
import AssignedRequirement from "./components/Main/AssignedRequirement.jsx";
import NotFoundPage from "./components/Main/NotFoundPage.jsx";

const AppRouter = () => {
  const [user, loading] = useAuthState(auth);
  const authUser = getAuth();
  const userlogin = authUser.currentUser;
  const [role, setRole] = useState(null);
  const [loadings, setLoadings] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (userlogin) {
        const roleRef = ref(db, `users/${userlogin.uid}/role`); // Adjust the path according to your structure
        const snapshot = await get(roleRef);
        if (snapshot.exists()) {
          setRole(snapshot.val());
        } else {
          console.log("No role data available");
        }
      }
      setLoadings(false);
    };

    fetchUserRole();
  }, [userlogin]);

  if (loadings) {
    return (
      <div className="min-h-[calc(100vh-80px)]">
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const renderRoleComponent = () => {
    switch (role) {
      case "faculty":
        return <Home />;
      case "it-team":
        return <ITteam />;
      case "admin":
        return <Admin />;
      case "it-admin-executive":
        return <IT_Admin_Executive />;
      default:
        return (
          <div className="min-h-[calc(100vh-80px)]">
            <div className="flex justify-center items-center h-screen bg-gray-50">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        );
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: userlogin ? (
        <PrivateRoute>
          <App />
        </PrivateRoute>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          path: "",
          element: <PrivateRoute>{renderRoleComponent()}</PrivateRoute>,
        },
        {
          path: "/ticket-form",
          element: (
            <PrivateRoute>
              <Ticket />
            </PrivateRoute>
          ),
        },
        {
          path: "/ticket/assigned-ticket",
          element: (
            <PrivateRoute>
              <AssignedTickets />
            </PrivateRoute>
          ),
        },
        {
          path: "/Requirement/assigned-Requirement",
          element: (
            <PrivateRoute>
              <AssignedRequirement />
            </PrivateRoute>
          ),
        },
        {
          path: "/ticket/tracking",
          element: (
            <PrivateRoute>
              <TrackTicket />
            </PrivateRoute>
          ),
        },
        {
          path: "/ticket/history",
          element: (
            <PrivateRoute>
              <HistoryTicket />
            </PrivateRoute>
          ),
        },
        {
          path: "/ticket-it-team/history",
          element: (
            <PrivateRoute>
              <HistoryItTeam />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/sign-up",
      element: user ? <Navigate to="/" /> : <SignUp />,
    },
    {
      path: "/verify-email",
      element: <VerifyEmail />,
    },
    {path: "/*",
      element: <NotFoundPage></NotFoundPage>
    }
  ]);

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    ); // Show a loader while checking user authentication and role
  }

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
