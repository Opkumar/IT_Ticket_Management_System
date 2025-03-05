import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return authUser ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
