import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { useAuthContext } from "../context/AuthContext.jsx";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(route, {
        username,
        password,
      });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (errors.username) {
          alert(`Username error: ${errors.username.join(", ")}`);
        } else if (errors.password) {
          alert(`Password error: ${errors.password.join(", ")}`);
        } else {
          alert("Something went wrong.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <h1>{name}</h1>
        <label htmlFor="username">Username: </label>
        <input
          className="form-input"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          className="form-input"
          placeholder="Enter your password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="form-button" type="submit" disabled={loading}>
        {loading ? <LoadingIndicator /> : name}
      </button>
    </form>
  );
}

export default Form;
