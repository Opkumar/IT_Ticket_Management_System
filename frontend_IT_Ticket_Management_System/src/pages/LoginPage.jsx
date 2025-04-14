import useAuthStore from "@/store/useAuthStore";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [messageGoogle, setMessageGoogle] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const { login, googleAuth, authUser,resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (authUser) {
      navigate("/"); // Redirect if already logged in
    }
  }, [authUser, navigate]);
  
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await resetPassword(resetEmail);
      setMessage("Password reset email sent! Check your inbox.");
      setShowResetForm(true);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        await googleAuth(authResult.code);
        navigate("/");
      } else {
        console.error("Google OAuth Failed:", authResult);
        setMessageGoogle("Google Login Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
      setMessageGoogle(`Google Login Error: ${error?.response?.data?.message || error.message}`);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const isValidDomain = (email) => {
    const allowedDomains = [
      "gdgu.org",
      "gdgoenka.com",
      "gdgoenkagurugram.in",
      "gdgoenkarohtak.com",
      "gdgss.in",
      "gdgoenka.ac.in",
    ];
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  const handleLogin = async (e) => {
    setMessageGoogle("");
    e.preventDefault();
  
    if (!navigator.onLine) {
      setMessage("You are offline. Please check your internet connection.");
      return;
    }
  
    if (!isValidDomain(email)) {
      setMessage("You can only log in using a GDGU email.");
      return;
    }
  
    setLoading(true);
    try {
      await login({ email, password }); // ✅ Await the async login call
      navigate("/");
    } catch (error) {
      setMessage(`Error: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-gray-100 bg-[url('https://www.services.bis.gov.in/php/BIS_2.0/BISBlog/wp-content/uploads/2023/07/Implementing-a-Quality-Management-System-and-Its-Core-Principles.jpg')] ">
      {loading ? (
        <div className="text-center">
          <div className="flex justify-center items-center h-screen ">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : !showResetForm ? (
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full mx-4 "
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

          <input
            type="email"
            placeholder="Email like 'abc@gdgu.org'"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full p-3 border rounded-md"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 w-full p-3 border rounded-md"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-4"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="flex justify-between mb-5">
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => {
                setShowResetForm(true);
                setMessage("");
                setMessageGoogle("");
              }}
            >
              Forget Password?
            </button>
            <Link className="text-blue-600 hover:underline" to="/signup">
              Create An Account
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Log In
          </button>
          <p className="text-center">or</p>

          <button
            onClick={googleLogin}
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            <i className="fa-brands fa-google"></i> Log In with Google
          </button>

          {messageGoogle && (
            <p className="mt-4 text-center text-red-600">
              {messageGoogle}
            </p>
          )}
          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </form>
        ) : (
          <form
            onSubmit={handlePasswordReset}
            className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h2>
  
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="mb-4 w-full p-3 border rounded-md"
            />
  
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Send Reset Link
            </button>
  
            <button
              type="button"
              className="mt-4 w-full bg-gray-600 text-white py-3 rounded-lg"
              onClick={() => setShowResetForm(false)}
            >
              Back to Login
            </button>
  
            {message && (
              <p className="mt-4 text-center text-red-600">{message}</p>
            )}
          </form>
      )}
    </div>
  );
}

export default LoginPage;
