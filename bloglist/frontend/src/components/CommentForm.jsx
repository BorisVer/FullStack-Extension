import { useState } from "react";
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
    <form onSubmit={handleSubmit}>
      <input
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button type="submit">add comment</button>
    </form>
  );
};

export default CommentForm;
