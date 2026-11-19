import { useState } from "react";
import { TextField, Button } from "@mui/material";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ margin: 5 }}>Login</h2>
      <div>
        <TextField
          label="Username"
          value={username}
          style={{ margin: 5 }}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          value={password}
          style={{ margin: 5 }}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" style={{ margin: 5 }}>login</Button>
      </div>
    </form>
  );
};

export default LoginForm;
