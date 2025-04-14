import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import useAuthStore from "@/store/useAuthStore";
import Logo from "@/components/logoComponent/Logo";

function HeaderPage() {
  const { authUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-slate-400 h-14 flex items-center justify-between">
      <div className="ml-1">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="flex gap-4 mr-1">
        <div className="flex items-center">
          {(authUser?.role === "faculty" || authUser?.role === "admin") && (
            <Link to="/create-ticket">
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
                  authUser?.userImage ||
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
                <div className="grid justify-center gap-1">
                  <div className="flex justify-center">
                    <img
                      src={
                        authUser?.userImage ||
                        `https://cdn-icons-png.flaticon.com/512/149/149071.png`
                      }
                      alt="userImage"
                      className="rounded-full w-[44px] h-[44px]"
                    />
                  </div>
                  <h2 className="mt-1 text-2xl text-center">
                    {authUser?.fullname?.lastname
                      ? `${authUser.fullname?.firstname} ${authUser.fullname?.lastname}`
                      : authUser.fullname?.firstname}
                  </h2>

                  <p>{authUser?.email}</p>
                </div>
              </SheetTitle>
              <div className="w-full text-left pt-10 space-y-5">
                {authUser?.role === "it-team" && (
                  <div className="grid justify-center">
                    <h3 className="font-bold text-lg">Rate Our Service</h3>
                    <div className="flex space-x-2">
                      {(() => {
                        const sentiments = authUser.sentiments || [];
                        const average =
                          sentiments.length > 0
                            ? sentiments.reduce((sum, val) => sum + val, 0) /
                              sentiments.length
                            : 0;

                        return [1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-2xl ${
                              star <= Math.round(average)
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          >
                            ★
                          </span>
                        ));
                      })()}
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

                  {authUser?.role !== "it-team" && (
                    <NavLink
                      to="/create-ticket"
                      className={({ isActive }) =>
                        isActive ? "bg-slate-300 rounded-sm p-1" : "p-1"
                      }
                    >
                      <SheetClose>
                        <li>Raise Ticket</li>
                      </SheetClose>
                    </NavLink>
                  )}

                  {authUser?.role === "it-team" && (
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
                  {authUser?.role === "it-team" && (
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

                  {authUser?.role === "faculty" && (
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

                  {authUser?.role === "faculty" && (
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

                  {authUser?.role === "it-team" && (
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
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default HeaderPage;
