import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import { useProfile } from "../context/ProfileContext";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { profile } = useProfile();

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/forum/posts/");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/forum/posts/", newPost);
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post. Only doctors can post.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Doctor Discussion Forum</h1>
      {profile?.role === "doctor" && (
        <div className="card shadow-sm mb-4">
          <div className="card-header">Create a New Post</div>
          <div className="card-body">
            <form onSubmit={handlePostSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Content
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows="3"
                  value={newPost.content}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="card shadow-sm">
        <div className="card-header">Recent Discussions</div>
        <div className="card-body">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <ul className="list-group list-group-flush">
              {posts.map((post) => (
                <li key={post.id} className="list-group-item">
                  <h5>
                    <Link to={`/forum/${post.id}`}>{post.title}</Link>
                  </h5>
                  <p>{post.content.substring(0, 100)}...</p>
                  <small className="text-muted">
                    By:{" "}
                    {post.author_profile.full_name ||
                      post.author_profile.username}{" "}
                    on {new Date(post.created_at).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forum;
