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

    // ✨ FIX: Create the nested structure the backend expects.
    const dataToSubmit = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      profile: {
        full_name: formData.full_name,
        role: formData.role,
        age: formData.age || null, // Send null if age is empty
        phone: formData.phone,
        address: formData.address,
      },
    };

    try {
      // Send the correctly formatted data
      const response = await api.post("api/auth/register/", dataToSubmit);

      // ✨ FIX: Check for 201 Created status
      if (response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        alert("Registration failed. Please check your input and try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        // Combine all error messages into one alert
        const messages = Object.values(errors).flat().join("\n");
        alert(messages || "An error occurred. Please try again.");
      } else {
        alert("Something went wrong with the connection. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5 bg-light">
      <div
        className="card p-4 shadow-sm"
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
