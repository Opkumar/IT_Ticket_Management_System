import React, { useState, useEffect } from "react";
import Logo from "../logoComponent/Logo";
import { NavLink, Link, useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";
// import { ref, get, onValue } from "firebase/database"; // Correct imports
// import { db } from "../config/firebaseConfig"; // Correct import for db

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

function Header() {
  // const navigate = useNavigate();
  // const auth = getAuth();
  // const userlogin = auth.currentUser;
  const [userData, setUserData] = useState(null); // State for user data

  const [rating, setRating] = useState(0); // Store the fetched rating
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // useEffect(() => {
  //   const ticketRef = ref(db, `users/${userlogin.uid}/sentiments`);

  //   const unsubscribe = onValue(
  //     ticketRef,
  //     (snapshot) => {
  //       if (snapshot.exists()) {
  //         const sentimentsData = snapshot.val(); // Get the object of sentiments

  //         // Extract the feedback values (assuming feedback is a key in each entry)
  //         const ratingsArray = Object.values(sentimentsData).map(
  //           (feedback) => feedback.feedback
  //         );

  //         // Calculate the total and average rating
  //         const totalRating = ratingsArray.reduce((sum, rate) => sum + rate, 0);
  //         const averageRating = totalRating / ratingsArray.length;

  //         // console.log("Fetched Average Rating:", averageRating);

  //         setRating(averageRating); // Update the rating state
  //       } else {
  //         // console.log("No rating data found for this user.");
  //         setRating(0); // Default rating if no data exists
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching real-time rating data:", error);
  //     }
  //   );

  //   // Cleanup listener on component unmount
  //   return () => unsubscribe(); // Use the return value of onValue as the cleanup function
  // }, [userlogin.uid]);

  // Fetch the user's data from Realtime Database
  // const fetchUserData = async () => {
  //   if (userlogin) {
  //     try {
  //       const userRef = ref(db, `users/${userlogin.uid}`); // Reference to user data
  //       const snapshot = await get(userRef); // Get the user data
  //       if (snapshot.exists()) {
  //         const data = snapshot.val();
  //         setUserData(data); // Set user data in state
  //       } else {
  //         console.log("No such user document found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, [userlogin]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // navigate("/login");
      // navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-slate-400 h-14 flex items-center justify-between">
      <div className="ml-1">
        <Logo />
      </div>
      <div className="flex gap-4 mr-1">
        <div className="flex items-center">
          {(userData?.role === "faculty" ||
            userData?.role === "admin" ||
            userData?.role === "it-admin-executive") && (
            <Link to="/ticket-form">
              <button className="px-3 py-1 mx-auto rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                Raise Ticket
              </button>
            </Link>
          )}
        </div>

        <Sheet>
          <SheetTrigger>
            <div className="w-[44px] h-[44px] overflow-hidden">
              <img
                src={
                  userData?.photoURL ||
                  `https://cdn-icons-png.flaticon.com/512/149/149071.png`
                }
                alt="userImage"
                className="rounded-full w-[44px] h-[44px]"
              />
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {/* <div className="grid justify-center gap-1">
                  <div className="flex justify-center">
                    <img
                      src={
                        userData?.photoURL ||
                        `https://cdn-icons-png.flaticon.com/512/149/149071.png`
                      }
                      alt="userImage"
                      className="rounded-full w-[44px] h-[44px]"
                    />
                  </div>
                  <h2 className="mt-1 text-2xl text-center">
                    {userData?.fullName}
                  </h2>
                  <p>{userData?.email}</p>
                </div> */}
              </SheetTitle>
              {/* <div className="w-full text-left pt-10 space-y-5">
                {userData?.role === "it-team" && (
                  <div className="grid justify-center">
                    <h3 className="font-bold text-lg">Rate Our Service</h3>
                    
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${
                            star <= rating ? "text-yellow-500" : "text-gray-400"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <ul className="grid gap-2 font-bold">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                    }
                  >
                    <SheetClose>
                      <li>Home</li>
                    </SheetClose>
                  </NavLink>

                  {userData?.role === "faculty" && (
                    <NavLink
                      to="/ticket-form"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>Raise Ticket</li>
                      </SheetClose>
                    </NavLink>
                  )}

                  {userData?.role === "it-team" && (
                    <NavLink
                      to="/ticket/assigned-ticket"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>Assigned Tickets</li>
                      </SheetClose>
                    </NavLink>
                  )}
                  {userData?.role === "it-team" && (
                    <NavLink
                      to="/Requirement/assigned-Requirement"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>Assigned Requirements</li>
                      </SheetClose>
                    </NavLink>
                  )}

                  {userData?.role === "faculty" && (
                    <NavLink
                      to="/ticket/tracking"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>Track Your Tickets</li>
                      </SheetClose>
                    </NavLink>
                  )}

                  {userData?.role === "faculty" && (
                    <NavLink
                      to="/ticket/history"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>History</li>
                      </SheetClose>
                    </NavLink>
                  )}

                  {userData?.role === "it-team" && (
                    <NavLink
                      to="/ticket-it-team/history"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>History</li>
                      </SheetClose>
                    </NavLink>
                  )}
                </ul>

                <button
                  onClick={handleLogout}
                  className="px-2 py-1 rounded-sm bg-slate-400 text-center items-center"
                >
                  Log Out
                </button>
              </div> */}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
