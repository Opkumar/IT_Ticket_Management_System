import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

const useRequirementStore = create((set, get) => ({
  userRequirements: [],
  userCompletedRequirements: [],
  allRequirements: [],
  createRequirement: async (requirementData) => {
    try {
      await axiosInstance.post("/requirements/create", requirementData);
      console.log("Requirements create successfully");
    } catch (error) {
      console.log(error.response.data.message);
    }
  },
  getUserRequirements: async (data) => {
    try {
      const res = await axiosInstance.get("/requirements/user-requirements");

      set({ userRequirements: res.data });
    } catch (error) {
      console.log(error.response.data.message);
      set({ userRequirements: [] });
      set({ userCompletedRequirements: [] });
    }
  },
  getAllRequirements: async () => {
    try {
      const res = await axiosInstance.get("/requirements/all");
      set({ allRequirements: res.data });
    } catch (error) {
      console.error(
        "Error fetching all requirements:",
        error.response?.data?.message || error.message
      );
      set({ allRequirements: [] });
    }
  },
  updateRequirement: async (updateData) => {
    try {
      await axiosInstance.post("/requirements/update", updateData);
    } catch (error) {
      console.error(
        "Error update requirement:",
        error.response?.data?.message || error.message
      );
    }
  },
}));

export default useRequirementStore;
