import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../components/config/firebaseConfig";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  // console.log(user);

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    ); // Show loading while the authentication state is being determined
  }

  if (!user) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  if (!user.emailVerified) {
    // If the user's email is not verified, redirect to a verification page or display a message
    return <Navigate to="/verify-email" />;
  }

  // If user is authenticated and email is verified, allow access to the route
  return children;
};

export default PrivateRoute;
