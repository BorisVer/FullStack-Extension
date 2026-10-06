import { useState } from "react";
import { TextField, Button } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <div>
      <h2 style={{ margin: 5 }}>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="Title"
            value={newTitle}
            style={{ margin: 5 }}
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder="title"
          />
        </div>
        <div>
          <TextField
            label="Author"
            value={newAuthor}
            style={{ margin: 5 }}
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder="author"
          />
        </div>
        <div>
          <TextField
            label="Url"
            value={newUrl}
            style={{ margin: 5 }}
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder="url"
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ margin: 5 }}>create</Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
