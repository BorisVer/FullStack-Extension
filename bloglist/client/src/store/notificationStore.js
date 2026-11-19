import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (text, type = "success", timeout = 5000) => {
    set({ notification: { text, type } });
    setTimeout(() => {
      set({ notification: null });
    }, timeout);
  },
}));

export default useNotificationStore;
