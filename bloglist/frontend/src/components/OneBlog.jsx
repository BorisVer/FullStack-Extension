import { Card, CardContent, Typography, CardActions, Button, Link } from "@mui/material";

const OneBlog = ({ blog, user, addLike, removeBlog }) => {
  if (!blog) {
    return null;
  }

  const isOwner = user && blog.user && (user.username === blog.user.username);

  const loggedIn = user !== null;


  return (
    <Card sx={{ maxWidth: 600, margin: '20px ', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">{blog.title}</Typography>
        <Typography variant="body1" component="div"><Link href={blog.url}>{blog.url}</Link></Typography>
        <Typography variant="body2" component="div">{blog.likes} likes</Typography>
        <Typography variant="body2" component="div">Added by {blog.user.username}</Typography>
      </CardContent>
      <CardActions>
        {loggedIn && (
          <Button
            variant="contained"
            onClick={() => addLike(blog.id)}
            sx={{ color: 'white', bgcolor: 'green' }}
          >
            Like
          </Button>
        )}
        {isOwner && (
          <Button
            variant="contained"
            onClick={() => removeBlog(blog.id)}
            sx={{ color: 'white', bgcolor: 'red' }}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};





export default OneBlog;
