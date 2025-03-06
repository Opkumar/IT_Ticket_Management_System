import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useTicketStore = create((set, get) => ({
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
  getUserTickets: async () => { 
    try {
      const res = await axiosInstance.get("/tickets/user-tickets");
      set({ userTickets: res.data });
    } catch (error) {
      console.error("Error fetching user tickets:", error);
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
      // set({ allTickets: [] });
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
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    // socket.off("ticketUpdates"); // Remove previous listener

    socket.on("ticketUpdates", (ticket) => {
      // console.log("New Ticket Update:", ticket);

      set((state) => {
        const existingIndex = state.userTickets.findIndex((t) => t._id === ticket._id);

        let updatedTickets;
        if (existingIndex !== -1) {
          updatedTickets = [...state.userTickets];
          updatedTickets[existingIndex] = ticket;
        } else {
          updatedTickets = [...state.userTickets, ticket];
        }

        // console.log("Updated Tickets:", updatedTickets);
        return { userTickets: updatedTickets };
      });
    });
},


  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("ticketUpdates");
  },
}));

export default useTicketStore;