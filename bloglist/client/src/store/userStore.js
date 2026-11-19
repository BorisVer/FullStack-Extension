import { create } from "zustand";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { getUser, saveUser, removeUser } from "../services/persistentUser";

const useUserStore = create((set) => ({
  user: null,

  initializeUser: () => {
    const user = getUser();
    if (user) {
      blogService.setToken(user.token);
      set({ user });
    }
  },

  login: async (userObject) => {
    const user = await loginService.login(userObject);
    saveUser(user);
    blogService.setToken(user.token);
    set({ user });
  },

  logout: () => {
    removeUser();
    set({ user: null });
  },
}));

export default useUserStore;
