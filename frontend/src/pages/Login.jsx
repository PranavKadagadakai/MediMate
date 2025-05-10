import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "../components/LoadingIndicator";
import { useAuthContext } from "../context/AuthContext.jsx";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("api/auth/token/", formData);
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthenticated(true);
        navigate("/dashboard");
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
    <div className="d-flex justify-content-center align-items-center vh-40 bg-light">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {loading ? <LoadingIndicator /> : "Login"}
          </button>
        </form>
        <p className="text-center mt-3 text-muted">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
