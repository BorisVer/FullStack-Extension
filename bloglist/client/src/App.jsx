import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";

import useNotificationStore from "./store/notificationStore";
import useBlogStore from "./store/blogStore";
import useUserStore from "./store/userStore";
import useUserListStore from "./store/userListStore";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import OneBlog from "./components/OneBlog";
import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import User from "./components/User";

import blogService from "./services/blogs";
import loginService from "./services/login";

import { AppBar, Toolbar, Button, Alert, Typography } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>try again</button>
    </div>
  );
};

const App = () => {
  // Blogs
  const blogs = useBlogStore((state) => state.blogs);
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs);
  const createBlog = useBlogStore((state) => state.createBlog);
  const likeBlog = useBlogStore((state) => state.likeBlog);
  const deleteBlog = useBlogStore((state) => state.removeBlog);
  const users = useUserListStore((state) => state.users);
  const fetchUsers = useUserListStore((state) => state.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    initializeBlogs();
  }, []);

  // User
  const user = useUserStore((state) => state.user);
  const initializeUser = useUserStore((state) => state.initializeUser);
  const loginUser = useUserStore((state) => state.login);
  const logoutUser = useUserStore((state) => state.logout);

  useEffect(() => {
    initializeUser();
  }, []);

  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );

  const navigate = useNavigate();

  const match = useMatch("/blogs/:id");
  const matchedBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null;

  const userMatch = useMatch("/users/:id");
  const matchedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null;

  const handleLogin = async (userObject) => {
    try {
      await loginUser(userObject);
      navigate("/");
    } catch {
      setNotification("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await createBlog(blogObject);

    setNotification(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      "success",
    );
    navigate("/");
  };

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
    </div>
  );

  const addLike = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    await likeBlog(id, updatedBlog);
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await deleteBlog(id);
      navigate("/");
    }
  };

  console.log("Current user in App:", user);
  console.log("User username:", user?.username);

  const hoverStyle = { "&:hover": { bgcolor: "lightgray" } };

  const Notification = () => {
    const notification = useNotificationStore((state) => state.notification);

    if (notification == null) {
      return null;
    } else {
      return (
        <Alert
          style={{ marginTop: 10, marginBottom: 10 }}
          severity={notification.type}
        >
          {notification.text}
        </Alert>
      );
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0.1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>
            new blog
          </Button>
          <Button color="inherit" component={Link} to="/users" sx={hoverStyle}>
            users
          </Button>
          {user ? (
            <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
              logout
            </Button>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Notification />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/" element={blogList()} />
          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route
            path="/blogs/:id"
            element={
              <OneBlog
                blog={matchedBlog}
                user={user}
                addLike={addLike}
                removeBlog={removeBlog}
              />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User user={matchedUser} />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
