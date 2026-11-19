import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CommentForm from "./CommentForm";

const OneBlog = ({ blog, user, addLike, removeBlog }) => {
  if (!blog) {
    return <h2>404 - Page not found</h2>;
  }

  const isOwner = user && blog.user && user.username === blog.user.username;

  const loggedIn = user !== null;

  return (
    <Card sx={{ maxWidth: 600, margin: "20px ", padding: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body1" component="div">
          <Link href={blog.url}>{blog.url}</Link>
        </Typography>
        <Typography variant="body2" component="div">
          {blog.likes} likes
        </Typography>
        <Typography variant="body2" component="div">
          Added by {blog.user.username}
        </Typography>
      </CardContent>
      <CardActions>
        {loggedIn && (
          <Button
            variant="contained"
            onClick={() => addLike(blog.id)}
            sx={{ color: "white", bgcolor: "green" }}
          >
            Like
          </Button>
        )}
        {isOwner && (
          <Button
            variant="contained"
            onClick={() => removeBlog(blog.id)}
            sx={{ color: "white", bgcolor: "red" }}
          >
            Delete
          </Button>
        )}
      </CardActions>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        comments
      </Typography>
      <CommentForm blogId={blog.id} />
      <Paper sx={{ mt: 2 }}>
        <List dense>
          {(blog.comments ?? []).map((comment, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={comment} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Card>
  );
};

export default OneBlog;
