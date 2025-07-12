import React, { useState } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

const Summarizer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSummary("");

    if (!file) {
      setError("❗ Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await api.post("/api/summarize/summarize/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data.summary);
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during summarization."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary).then(() => {
      alert("Summary copied to clipboard!");
    });
  };

  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">
            <i className="bi bi-file-text-fill me-2"></i>Medical Report
            Summarization
          </h2>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Upload a medical document (PDF, DOCX, TXT) to generate a concise
            summary.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="file-upload" className="form-label">
                Select Medical Report:
              </label>
              <input
                type="file"
                className="form-control"
                id="file-upload"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <LoadingIndicator />
                ) : (
                  <>
                    {" "}
                    <i className="bi bi-magic me-1"></i> Generate Summary{" "}
                  </>
                )}
              </button>
            </div>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {summary && (
            <div className="card border-success mt-4">
              <div className="card-header bg-success text-white">
                Summary Result
              </div>
              <div className="card-body" style={{ whiteSpace: "pre-line" }}>
                {summary}
              </div>
              <div className="card-footer text-end">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={copyToClipboard}
                >
                  <i className="bi bi-clipboard me-1"></i> Copy
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer text-muted small">
          <i className="bi bi-shield-lock me-1"></i> Your documents are
          processed securely and are not stored.
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
