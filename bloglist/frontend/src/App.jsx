import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import OneBlog from "./components/OneBlog";
import LoginForm from "./components/LoginForm";
import { AppBar, Toolbar, Button, Alert, Typography } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <h2>AN ERROR!!!!!!!</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>try again</button>
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  const match = useMatch("/blogs/:id");
  const matchedBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null;

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      navigate("/");
    } catch {
      setNotification({ text: "wrong username or password", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    const allBlogs = await blogService.getAll();
    setBlogs(allBlogs);
    setNotification({
      text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      type: "success",
    });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
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

    const returnedBlog = await blogService.update(id, updatedBlog);
    setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)));
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
      navigate("/");
    }
  };

  console.log("Current user in App:", user);
  console.log("User username:", user?.username);

  const hoverStyle = { "&:hover": { bgcolor: "lightgray" } };

  const Notification = ({ notification }) => {
    if (notification === null) {
      return null;
    }
    return (
      <Alert
        style={{ marginTop: 10, marginBottom: 10 }}
        severity={notification.type}
      >
        {notification.text}
      </Alert>
    );
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
      <Notification notification={notification} />
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
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
