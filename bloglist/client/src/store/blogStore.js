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
  likeBlog: async (blogId, updatedBlogData) => {
    const returnedBlog = await blogService.update(blogId, updatedBlogData);
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id !== blogId ? blog : returnedBlog,
      ),
    }));
  },
  removeBlog: async (blogId) => {
    await blogService.remove(blogId);
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog.id !== blogId),
    }));
  },
  addComment: async (id, comment) => {
    const updated = await blogService.addComment(id, comment);
    set((state) => ({
      blogs: state.blogs.map((b) =>
        b.id === id ? { ...b, comments: updated.comments } : b,
      ),
    }));
  },
}));

export default useBlogStore;
