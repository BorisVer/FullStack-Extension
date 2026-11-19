import { Link } from "react-router-dom";

const Blog = ({ blog,  user }) => {
  console.log('Blog component received user prop:', user)
  console.log('Blog user:', blog.user)

  return (
    <ul>
      <li>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      </li>
    </ul>
  );
};

export default Blog;
