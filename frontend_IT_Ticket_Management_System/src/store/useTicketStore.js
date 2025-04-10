import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useTicketStore = create((set, get) => ({
  userTickets: [],
  userCompletedTickets: [],
  allTickets: [],

  createTicket: async (ticketData) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("/tickets/create", ticketData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Ticket created successfully");
    } catch (error) {
      console.error(
        "Error creating ticket:",
        error.response?.data?.message || error.message
      );
    }
  },

  getUserTickets: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/tickets/user-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ userTickets: res.data });
    } catch (error) {
      console.error("Error fetching user tickets:", error);
    }
  },

  getAllTickets: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/tickets/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ allTickets: res.data });
    } catch (error) {
      console.error(
        "Error fetching all tickets:",
        error.response?.data?.message || error.message
      );
    }
  },

  updateTicket: async (updateData) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("/tickets/update", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(
        "Error updating ticket:",
        error.response?.data?.message || error.message
      );
    }
  },
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
  
    if (!socket) {
      console.warn("Socket not initialized, cannot subscribe to messages.");
      return;
    }
  
    socket.on("ticketUpdates", (ticket) => {
      console.log("Received ticket update via socket:", ticket);
  
      set((state) => {
        const existingIndex = state.userTickets.findIndex((t) => t._id === ticket._id);
        const existingIndex1 = state.allTickets.findIndex((t) => t._id === ticket._id);
  
        let updatedTickets;
        let updatedAllTickets;
  
        if (existingIndex !== -1) {
          updatedTickets = [...state.userTickets];
          updatedTickets[existingIndex] = ticket;
        } else {
          updatedTickets = [...state.userTickets, ticket];
        }
  
        if (existingIndex1 !== -1) {
          updatedAllTickets = [...state.allTickets];
          updatedAllTickets[existingIndex1] = ticket;
        } else {
          updatedAllTickets = [...state.allTickets, ticket]; // ✅ Corrected this line
        }
  
        return {
          userTickets: updatedTickets,
          allTickets: updatedAllTickets,
        };
      });
    });
  },
  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
  
    if (!socket) {
      console.warn("Socket not initialized, cannot unsubscribe from messages.");
      return;
    }
  
    socket.off("ticketUpdates");
  },
  
  
  // subscribeToMessages: () => {
  //   const socket = useAuthStore.getState().socket;

  //   socket.on("ticketUpdates", (ticket) => {
  //     set((state) => {
  //       const existingIndex = state.userTickets.findIndex((t) => t._id === ticket._id);

  //       let updatedTickets;
  //       if (existingIndex !== -1) {
  //         updatedTickets = [...state.userTickets];
  //         updatedTickets[existingIndex] = ticket;
  //       } else {
  //         updatedTickets = [...state.userTickets, ticket];
  //       }

  //       return { userTickets: updatedTickets };
  //     });
  //   });
  // },

  // unsubscribeFromMessages: () => {
  //   const socket = useAuthStore.getState().socket;
  //   socket.off("ticketUpdates");
  // },
}));

export default useTicketStore;

// import { axiosInstance } from "@/lib/axios";
// import { create } from "zustand";
// import { useAuthStore } from "./useAuthStore";

// export const useTicketStore = create((set, get) => ({
//   userTickets: [],
//   userCompletedTickets: [],
//   allTickets: [],

//   createTicket: async (ticketData) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.post("/tickets/create",{token}, ticketData);
//       console.log("Ticket create successfully ");
//     } catch (error) {
//       console.error(
//         "Error creating ticket:",
//         error.response?.data?.message || error.message
//       );
//     }
//   },
//   getUserTickets: async () => { 
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get("/tickets/user-tickets",{token});
//       set({ userTickets: res.data });
//     } catch (error) {
//       console.error("Error fetching user tickets:", error);
//     }
//   },
//   getAllTickets: async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axiosInstance.get("/tickets/all",{token});
//       set({ allTickets: res.data });
//     } catch (error) {
//       console.error(
//         "Error fetching all tickets:",
//         error.response?.data?.message || error.message
//       );
      
//     }
//   },
//   updateTicket: async (updateData) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.post("/tickets/update",{token}, updateData);
//     } catch (error) {
//       console.error(
//         "Error update ticket:",
//         error.response?.data?.message || error.message
//       );
//     }
//   },
//   subscribeToMessages: () => {
//     const socket = useAuthStore.getState().socket;

//     // socket.off("ticketUpdates"); // Remove previous listener

//     socket.on("ticketUpdates", (ticket) => {
//       // console.log("New Ticket Update:", ticket);

//       set((state) => {
//         const existingIndex = state.userTickets.findIndex((t) => t._id === ticket._id);

//         let updatedTickets;
//         if (existingIndex !== -1) {
//           updatedTickets = [...state.userTickets];
//           updatedTickets[existingIndex] = ticket;
//         } else {
//           updatedTickets = [...state.userTickets, ticket];
//         }

//         // console.log("Updated Tickets:", updatedTickets);
//         return { userTickets: updatedTickets };
//       });
//     });
// },


  
//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("ticketUpdates");
//   },
// }));

// export default useTicketStore;