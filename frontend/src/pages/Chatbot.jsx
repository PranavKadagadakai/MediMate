import React, { useState } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function Chatbot() {
  const [history, setHistory] = useState([
    {
      author: "bot",
      text: "Hello! I'm your medical assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { author: "user", text: input };
    setHistory((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/chatbot/chat/", { message: input });
      const botMessage = { author: "bot", text: res.data.response };
      setHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        author: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setHistory((prev) => [...prev, errorMessage]);
      console.error("Chatbot API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">
            <i className="bi bi-robot me-2"></i>AI Medical Chatbot
          </h2>
        </div>
        <div
          className="card-body"
          style={{ height: "500px", overflowY: "auto" }}
          ref={(el) => el && (el.scrollTop = el.scrollHeight)}
        >
          {history.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${
                msg.author === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded ${
                  msg.author === "user" ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-start">
              <LoadingIndicator />
            </div>
          )}
        </div>
        <div className="card-footer">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="e.g. What are the symptoms of the flu?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                <i className="bi bi-send"></i>
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer bg-warning-subtle text-dark-emphasis small">
          <strong>Note:</strong> This AI assistant provides general information
          only and is not a substitute for professional medical advice.
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
