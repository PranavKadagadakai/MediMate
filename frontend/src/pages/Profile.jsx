import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

function Profile() {
  const { profile, loading } = useProfile();

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>You must be logged in to edit your profile.</p>;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3 className="text-center mb-4">Profile</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Username:</strong> {profile.username}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {profile.email}
          </li>
          <li className="list-group-item">
            <strong>Full Name:</strong> {profile.full_name || "N/A"}
          </li>
          <li className="list-group-item">
            <strong>Age:</strong> {profile.age || "N/A"}
          </li>
          <li className="list-group-item">
            <strong>Role:</strong> {profile.role || "N/A"}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {profile.phone || "N/A"}
          </li>
          <li className="list-group-item">
            <strong>Address:</strong> {profile.address || "N/A"}
          </li>
        </ul>
        <div className="text-center mt-4">
          <Link to="/edit-profile" className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
