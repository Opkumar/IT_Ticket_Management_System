import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import io from "socket.io-client";
// const BASE_URL = "https://it-ticket-management-system-xi.vercel.app";
const BASE_URL = "https://it-ticket-management-system.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  validUrl: null,
  allUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/users/check", {
        withCredentials: true, // VERY IMPORTANT to include cookies
      });
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.log(
        "Error in checkAuth:",
        error?.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (info) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/signup", info);
      set({ authUser: res.data });
      console.log("User signed up successfully");
    } catch (error) {
      console.log(
        "Signup Error:",
        error?.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  verify: async (id, token) => {
    try {
      const response = await axiosInstance.get(`/users/${id}/verify/${token}`);
      set({ validUrl: response.data.verified });
    } catch (error) {
      console.log(
        "Verification failed:",
        error?.response?.data?.message || error.message
      );
      set({ validUrl: false });
    }
  },

  googleAuth: async (code) => {
    try {
      const res = await axiosInstance.get(`/users/google?code=${code}`);
      set({ authUser: res.data });
      console.log("Google login successful");
      await get().checkAuth();
      get().connectSocket();
    } catch (error) {
      console.log(
        "Google Auth Error:",
        error?.response?.data?.message || error.message
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // login: async (info) => {
  //   set({ isLoggingIn: true });
  //   try {
  //     const res = await axiosInstance.post("/users/login", info, {
  //       withCredentials: true,
  //     });
  //     set({ authUser: res.data });
  //     console.log("User login successful");
  //     get().connectSocket();
  //   } catch (error) {
  //     console.log(
  //       "Login Error:",
  //       error?.response?.data?.message || error.message
  //     );
  //     set({ authUser: null });
  //   } finally {
  //     set({ isLoggingIn: false });
  //   }
  // },
  login: async (info) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", info, {
        withCredentials: true,
      });
      set({ authUser: res.data });
      console.log("User login successful");

      // 🔥 ADD THIS LINE — re-validate session after login
      await get().checkAuth();

      get().connectSocket();
    } catch (error) {
      console.log(
        "Login Error:",
        error?.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/users/logout");
      set({ authUser: null });
      console.log("User logged out successfully");
      get().socket.disconnect();
    } catch (error) {
      console.log(
        "Logout Error:",
        error?.response?.data?.message || error.message
      );
    }
  },

  updateUser: async (userData) => {
    try {
      await axiosInstance.post("/users/update", userData);
      console.log("User updated successfully");
    } catch (error) {
      console.log(
        "Update User Error:",
        error?.response?.data?.message || error.message
      );
    }
  },
  getAllUsers: async () => {
    try {
      const res = await axiosInstance.get("/users/get-users");
      set({ allUsers: res.data });
    } catch (error) {
      console.log(
        "get Users Error:",
        error?.response?.data?.message || error.message
      );
      set({ allUsers: [] });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL);
    socket.connect();

    set({ socket: socket });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

export default useAuthStore;
