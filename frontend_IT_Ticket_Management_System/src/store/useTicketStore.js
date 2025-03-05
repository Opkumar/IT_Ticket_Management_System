import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

const useTicketStore = create((set, get) => ({
  userTickets: [],
  userCompletedTickets: [],
  allTickets: [],

  createTicket: async (ticketData) => {
    try {
      await axiosInstance.post("/tickets/create", ticketData);
      console.log("Ticket create successfully ");
    } catch (error) {
      console.error(
        "Error creating ticket:",
        error.response?.data?.message || error.message
      );
    }
  },
  getUserTickets: async (data) => {
    try {
      const res = await axiosInstance.get("/tickets/user-tickets");
      
        set({ userTickets: res.data });
      
    } catch (error) {
      console.error(
        "Error fetching user tickets:",
        error.response?.data?.message || error.message
      );
      set({ userTickets: [] });
      set({ userCompletedTickets: [] });
    }
  },
  getAllTickets: async () => {
    try {
      const res = await axiosInstance.get("/tickets/all");
      set({ allTickets: res.data });
    } catch (error) {
      console.error(
        "Error fetching all tickets:",
        error.response?.data?.message || error.message
      );
      set({ allTickets: [] });
    }
  },
  updateTicket: async (updateData) => {
    try {
      await axiosInstance.post("/tickets/update", updateData);
    } catch (error) {
      console.error(
        "Error update ticket:",
        error.response?.data?.message || error.message
      );
    }
  },
}));

export default useTicketStore;
