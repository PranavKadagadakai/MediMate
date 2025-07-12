import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import { useProfile } from "../context/ProfileContext";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

  const fetchPostAndComments = async () => {
    setLoading(true);
    try {
      const postRes = await api.get(`/api/forum/posts/${id}/`);
      setPost(postRes.data);
      setComments(postRes.data.comments);
    } catch (error) {
      console.error("Failed to fetch post details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/api/forum/comments/`, { content: newComment, post: id });
      setNewComment("");
      fetchPostAndComments(); // Refresh data
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to add comment. Only doctors can comment.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <LoadingIndicator />
      </div>
    );
  if (!post) return <div className="alert alert-danger">Post not found.</div>;

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2>{post.title}</h2>
          <small className="text-muted">
            By {post.author_profile.full_name || post.author_profile.username}{" "}
            on {new Date(post.created_at).toLocaleString()}
          </small>
        </div>
        <div className="card-body">
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h4>Comments ({comments.length})</h4>
        </div>
        <div className="card-body">
          {comments.map((comment) => (
            <div key={comment.id} className="border-bottom mb-3 pb-3">
              <p>{comment.content}</p>
              <small className="text-muted">
                By{" "}
                {comment.author_profile.full_name ||
                  comment.author_profile.username}{" "}
                on {new Date(comment.created_at).toLocaleString()}
              </small>
            </div>
          ))}
          {profile?.role === "doctor" && (
            <form onSubmit={handleCommentSubmit} className="mt-3">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Add Comment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
