import { create } from "zustand";
import blogService from "../services/blogs";

const useBlogStore = create((set) => ({
  blogs: [],
  initializeBlogs: async () => {
    const blogs = await blogService.getAll();
    set({ blogs });
  },
  createBlog: async (blogObject) => {
    const newBlog = await blogService.create(blogObject);
    set((state) => ({ blogs: [...state.blogs, newBlog] }));
    return newBlog;
  },
}));

export default useBlogStore;
