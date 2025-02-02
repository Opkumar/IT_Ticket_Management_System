import React, { useEffect, useState } from 'react';
import { auth } from './config/firebaseConfig';
import { ref as dbRef, remove } from "firebase/database";
import { sendEmailVerification, deleteUser } from 'firebase/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { db } from './config/firebaseConfig'; // Ensure db is imported

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  const handleSendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email sent. Please check your inbox.');

        // Clear the message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      } catch (error) {
        setError(error.message);

        // Clear the error after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
    } else {
      setError('No user is logged in.');
    }
  };

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // Reload the user data
        if (auth.currentUser.emailVerified) {
          setRedirect(true); // Set redirect to true if verified
        }
      }
    };

    const intervalId = setInterval(checkEmailVerification, 3000); // Check every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (redirect) {
    return <Navigate to="/login" />; // Redirect to login if email is verified
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Verify your Email</h2>
        {message && <div className="text-green-500 text-center mb-4">{message}</div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <p className="text-center mb-6">Please verify your email to access the platform.</p>
        
        <button
          onClick={handleSendVerificationEmail}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Resend Verification Email
        </button>
        
        <button
          onClick={async () => {
            if (auth.currentUser) {
              const user = auth.currentUser;
              try {
                // Remove the user data from Realtime Database
                await remove(dbRef(db, `users/${user.uid}`));

                // Sign the user out
                await auth.signOut();

                // Delete the user from Firebase Authentication
                await deleteUser(user);

                // Navigate to login
                navigate("/login");
              } catch (error) {
                setError(`Error deleting user: ${error.message}`);
              }
            }
            
          }}
          className="text-right hover:underline mt-5"
        >
          Go to Log In
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
