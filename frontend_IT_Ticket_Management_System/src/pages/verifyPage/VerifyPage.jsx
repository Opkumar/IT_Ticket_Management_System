import React, { useEffect, useState, Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { CheckCircle, XCircle } from "lucide-react";

const VerifyPage = () => {
  const { verify, validUrl } = useAuthStore();
  const { id, token } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await verify(id, token); // Calls the store function for verification
      } catch (error) {
        console.error("Verification failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      verifyEmail();
    }
  }, [id, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        {loading ? (
          <h1 className="text-blue-500 text-xl font-bold animate-pulse">
            Verifying...
          </h1>
        ) : validUrl ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
            <h1 className="text-xl font-semibold mt-4">
              Email Verified Successfully 🎉
            </h1>
            <p className="text-gray-600 mt-2">
              You can now log in to your account.
            </p>
            <Link to="/login">
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600 transition">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-xl font-semibold mt-4 text-red-600">
              404 - Not Found
            </h1>
            <p className="text-gray-600 mt-2">
              The verification link is invalid or has already been used.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
