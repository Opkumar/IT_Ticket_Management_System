import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center ">
      <div className="text-center">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/008/255/803/small/page-not-found-error-404-system-updates-uploading-computing-operation-installation-programs-system-maintenance-a-hand-drawn-layout-template-of-a-broken-robot-illustration-vector.jpg"
          alt="Page Not Found Illustration"
          className="max-w-xs mx-auto"
        />
        <div className="mt-6">
          <p className="mb-4 text-lg font-medium text-gray-700">Oops! Page not found.</p>
          <div className="flex justify-center items-center gap-3">
            <p className="text-gray-600">Go to Login page:</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
