import { useState } from "react";
import EditProfileForm from "../components/EditProfileForm";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    role: "",
    age: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("api/auth/register/", formData);
      if (response.status === 200) {
        alert("Registration successful! Please log in.");
        console.log("Registration successful");
        navigate("/login");
      } else if (response.status === 201) {
        alert("Registration successful! Please log in.");
        console.log("Registration successful");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
        console.log("Registration failed");
        console.log(response);
        console.log(response.status);
        console.log(response.data);
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
    console.log("Registering:", formData);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-40 bg-light">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h3 className="text-center mb-3">Sign Up</h3>
        <EditProfileForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onSubmit={handleSubmit}
          isRegister
        />
        <p className="text-center mt-3 text-muted">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
