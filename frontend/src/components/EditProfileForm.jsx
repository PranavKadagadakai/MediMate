import LoadingIndicator from "./LoadingIndicator.jsx";

function EditProfileForm({
  formData,
  setFormData,
  loading,
  onSubmit,
  isRegister = false,
}) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit}>
      {isRegister && (
        <>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
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
        </>
      )}

      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {isRegister && (
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Role</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <textarea
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <button
        type="submit"
        className={`btn btn-${isRegister ? "primary" : "success"} w-100`}
      >
        {loading ? (
          <LoadingIndicator />
        ) : isRegister ? (
          "Sign Up"
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}

export default EditProfileForm;
