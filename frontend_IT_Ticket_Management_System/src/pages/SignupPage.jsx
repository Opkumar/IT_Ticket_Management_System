import useAuthStore from "@/store/useAuthStore";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuthStore();
  
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      setProfileImage(null);
      return;
    }
    setProfileImage(file);
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isValidDomain = (email) => {
    const allowedDomains = [
      "@gdgu.org",
      "@gdgoenka.com",
      "@gdgoenkagurugram.in",
      "@gdgoenkarohtak.com",
      "@gdgss.in",
      "@gdgoenka.ac.in",
    ];
    return allowedDomains.some((domain) => email.endsWith(domain));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Check if the email is from the allowed domain
    if (!isValidDomain(email)) {
      setError("Only GDGU emails are allowed to register.");
      setLoading(false);
      return;
    }

    try {
      let userImageBase64 = null;

      if (profileImage) {
        userImageBase64 = await convertImageToBase64(profileImage);
      }
      

      await signup({
        fullname: {
          firstname,
          lastname,
        },
        email,
        password,
        userImage: userImageBase64,
      });

      setMessage(
        "Registration successful! Please check your email to verify your account."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-cover bg-gray-100 bg-[url('https://www.services.bis.gov.in/php/BIS_2.0/BISBlog/wp-content/uploads/2023/07/Implementing-a-Quality-Management-System-and-Its-Core-Principles.jpg')]">
      <div className="max-w-md  mt-10 p-6 w-full bg-white  shadow-md  rounded-lg mx-4 ">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {message && (
          <div className="text-green-500 text-center mb-4">{message}</div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="">
            <label className="block text-gray-700">Full Name</label>
            <div className="mb-4 gap-2 flex">
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name (Optional)"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gdgu.org"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="confirm password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-2 top-2"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="mb-4">
            <label className="block text-gray-700">Profile Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          <div className="mt-5 text-right text-blue-600 hover:underline">
            <Link to="/login">Go to Log In Page</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
