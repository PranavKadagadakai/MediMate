import { useEffect, useState } from "react";
import EditProfileForm from "../components/EditProfileForm";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

function EditProfile() {
  const { profile, setProfile, loading } = useProfile();

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>You must be logged in to edit your profile.</p>;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...profile });
  const [currentLoading, setCurrentLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentLoading(true);

    try {
      const response = await api.post("api/auth/profile/", formData); // or PATCH if partial update

      if (response.status === 200 || response.status === 204) {
        setProfile(response.data); // Update global context
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong.");
    } finally {
      setCurrentLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Edit Profile</h3>
        <EditProfileForm
          formData={formData}
          setFormData={setFormData}
          loading={currentLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default EditProfile;
