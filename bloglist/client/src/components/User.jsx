import { Link } from "react-router-dom";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const User = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 2 }}>
        {user.name}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        added blogs
      </Typography>
      <Paper>
        <List>
          {user.blogs.length === 0 && (
            <ListItem>
              <ListItemText secondary="no blogs yet" />
            </ListItem>
          )}
          {user.blogs.map((blog) => (
            <ListItem key={blog.id} disablePadding>
              <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
                <ListItemText primary={blog.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default User;
