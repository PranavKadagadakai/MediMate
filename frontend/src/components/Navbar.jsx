import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarIcon from "../assets/navbarIcon.svg"; // Make sure this is a valid SVG path
import { useAuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center text-dark text-decoration-none"
        >
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "40px", height: "40px" }}
          >
            <img
              src={NavbarIcon}
              alt="Logo"
              width="24"
              height="24"
              style={{ filter: "invert(1)" }}
            />
          </div>
          <span className="fs-5 fw-bold">MediMate</span>
        </Link>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
