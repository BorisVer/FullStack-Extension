import { useState } from "react";
import { TextField, Button } from "@mui/material";
import useBlogStore from "../store/blogStore";

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const addComment = useBlogStore((state) => state.addComment);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    await addComment(blogId, comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
      <TextField
        label="write a comment"
        size="small"
        fullWidth
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <Button type="submit" variant="contained">
        add comment
      </Button>
    </form>
  );
};

export default CommentForm;
