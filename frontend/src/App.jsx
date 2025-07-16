import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Translate from "./pages/Translate.jsx";
import Forum from "./pages/Forum.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Logout from "./pages/Logout.jsx";
import Summarizer from "./pages/Summarizer.jsx";
import Messenger from "./pages/Messenger.jsx";

// ✨ FIX: Removed the incorrect RegisterAndLogout component.
// The logic is better handled in the Logout component and by navigating on success.

function App() {
  return (
    <>
      <header className="bg-white shadow text-gray-700">
        <Navbar />
      </header>
      <main className="flex-shrink-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/translate"
            element={
              <ProtectedRoute>
                <Translate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summarize"
            element={
              <ProtectedRoute>
                <Summarizer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/:id"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <ProtectedRoute>
                <Messenger />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
