import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
// import { get, ref as dbRef, set } from "firebase/database";
// import { deleteUser } from "firebase/auth";
// import { db, auth } from "../config/firebaseConfig"; // Use the imported 'auth' from your firebaseConfig

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resetEmail, setResetEmail] = useState(""); // State for password reset email
  const [showResetForm, setShowResetForm] = useState(false); // Toggle for the reset form
  const [loading, setLoading] = useState(false); // Loading state for email login
  const [googleLoading, setGoogleLoading] = useState(false); // Loading state for Google login
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider(); // Initialize the Google Auth provider
  const [messageGoogle, setMessageGoogle] = useState(false); // Loading state for email login

  // console.log(messageGoogle);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Helper function to check the email domain
  // const isValidDomain = (email) => {
  //   const domain = email.split("@")[1];
  //   return domain === "gdgu.org" ||
  //       "gdgoenka.com" ||
  //       "gdgoenkagurugram.in" ||
  //       "gdgoenkarohtak.com" ||
  //       "gdgss.in" ||
  //       "gdgoenka.ac.in";
  // };
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

  const handleLoginWithGoogle = async () => {
    setGoogleLoading(true); // Set Google loading to true
    try {
      const data = await signInWithPopup(auth, provider);
      const user = data.user;

      // Check if the signed-in Google user's email is from @gdgu.org
      // const domain = user.email.split("@")[1];
      if (isValidDomain(user.email)) {
        // Reference to the user's data in the database
        const userRef = dbRef(db, "users/" + user.uid);

        // Check if user already exists
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          // Save the user data in the database (only if they don't already exist)
          await set(userRef, {
            fullName: user.displayName,
            email: user.email,
            role: "faculty",
            photoURL: user.photoURL,
            todayAcceptedTickets: 0,
            todayCompletedTickets: 0,
          });
        }

        // console.log(data);
        setMessageGoogle(false);

        navigate("/"); // Navigate to home or dashboard after successful login
      } else {
        await auth.signOut();
        await deleteUser(user);
        setMessageGoogle(true);
        localStorage.setItem("messageGoogle", "true");
        window.dispatchEvent(new Event("storageChange"));
      }
    } catch (error) {
      setMessage(`Google sign-in failed: ${error.message}`);
    } finally {
      setGoogleLoading(false); // Set Google loading to false after operation
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedMessageGoogle = localStorage.getItem("messageGoogle");
      if (storedMessageGoogle === "true") {
        setMessageGoogle(true);
        localStorage.removeItem("messageGoogle"); // Clear it from local storage after setting
      }
    };

    window.addEventListener("storageChange", handleStorageChange); // Listen for custom event

    return () => {
      window.removeEventListener("storageChange", handleStorageChange); // Cleanup event listener
    };
  }, []);

  const handleLogin = async (e) => {
    setMessageGoogle(false);

    e.preventDefault();
    if (!navigator.onLine) {
      setMessage("You are offline. Please check your internet connection.");
      return;
    }

    // Check if the email has the correct domain
    if (!isValidDomain(email)) {
      setMessage("You can only log in using a GDGU email.");
      return;
    }

    setLoading(true); // Set loading to true
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate("/");
      } else {
        setMessage("Please verify your email before logging in.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Password reset email sent! Check your inbox.");
      setShowResetForm(false);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-gray-100 bg-[url('https://www.services.bis.gov.in/php/BIS_2.0/BISBlog/wp-content/uploads/2023/07/Implementing-a-Quality-Management-System-and-Its-Core-Principles.jpg')] ">
      {loading || googleLoading ? ( // Check for both loading states
        <div className="text-center">
          <div className="flex justify-center items-center h-screen ">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div> // Loading indicator
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
              onClick={() => setShowResetForm(true)}
            >
              Forget Password?
            </button>
            <Link className="text-blue-600 hover:underline" to="/sign-up">
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
            onClick={() => handleLoginWithGoogle()}
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            <i className="fa-brands fa-google"></i> Log In with Google
          </button>

          {messageGoogle && (
            <p className="mt-4 text-center text-red-600">
              You can only log in using a GDGU email.
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
};

export default Login;
