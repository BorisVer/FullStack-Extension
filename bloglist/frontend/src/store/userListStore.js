import { create } from "zustand";
import usersService from "../services/users";

const useUserListStore = create((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await usersService.getAll();
      set({ users, loading: false });
    } catch (error) {
      console.error("failed to fetch users", error);
      set({ loading: false });
    }
  },
}));

export default useUserListStore;
