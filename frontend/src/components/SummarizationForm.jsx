import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import api from "../api";

const SummarizationForm = () => {
  const { isAuthenticated } = useAuthContext();
  const { profile } = useProfile();

  const [file, setFile] = useState(null);
  const [includeDiagnoses, setIncludeDiagnoses] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
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
    // formData.append("include_diagnoses", includeDiagnoses);
    // formData.append("include_medications", includeMedications);
    // formData.append("include_recommendations", includeRecommendations);

    try {
      setLoading(true);
      const response = await api.post("/api/summarize/", formData);
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong.");
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
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                <i className="fas fa-file-medical me-2"></i>
                Medical Report Summarization
              </h2>
            </div>

            <div className="card-body">
              {isAuthenticated && profile && (
                <p className="text-muted mb-2">
                  Logged in as: <strong>{profile.email}</strong>
                </p>
              )}
              <p className="lead mb-4">
                Upload your medical document to generate a concise, structured
                summary highlighting key findings and recommendations.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="file-upload" className="form-label fw-bold">
                    Select medical report:
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      id="file-upload"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                    />
                    <span className="input-group-text bg-light">
                      <i className="fas fa-file-upload"></i>
                    </span>
                  </div>
                  <div className="form-text">
                    Supported formats: PDF, DOCX, TXT (Max size: 10MB)
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Summarization options:
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="include-diagnoses"
                      checked={includeDiagnoses}
                      onChange={(e) => setIncludeDiagnoses(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="include-diagnoses"
                    >
                      Include diagnoses
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="include-medications"
                      checked={includeMedications}
                      onChange={(e) => setIncludeMedications(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="include-medications"
                    >
                      Include medications
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="include-recommendations"
                      checked={includeRecommendations}
                      onChange={(e) =>
                        setIncludeRecommendations(e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="include-recommendations"
                    >
                      Include recommendations
                    </label>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button
                    type="reset"
                    className="btn btn-light me-md-2"
                    onClick={() => {
                      setFile(null);
                      setSummary("");
                      setError("");
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <i
                      className={`fas ${
                        loading ? "fa-spinner fa-spin" : "fa-magic"
                      } me-1`}
                    ></i>
                    {loading ? "Generating..." : "Generate Summary"}
                  </button>
                </div>
              </form>

              {error && <div className="text-danger mt-3">{error}</div>}

              {summary && (
                <div className="card border-success shadow-sm mt-4">
                  <div className="card-header bg-success text-white">
                    <i className="fas fa-notes-medical me-2"></i> Summary Result
                  </div>
                  <div
                    className="card-body"
                    style={{
                      whiteSpace: "pre-line",
                      fontFamily: "Courier New, monospace",
                      lineHeight: 1.6,
                    }}
                  >
                    {summary}
                  </div>
                  <div className="card-footer text-end">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={copyToClipboard}
                    >
                      <i className="fas fa-copy me-1"></i> Copy to Clipboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer text-muted">
              <div className="d-flex align-items-center">
                <i className="fas fa-shield-alt me-2"></i>
                <small>
                  Your documents are processed securely and not stored after
                  summarization.
                </small>
              </div>
            </div>
          </div>

          {/* <div className="mt-4 text-center">
            <a href="/sample-report" className="text-decoration-none">
              <i className="fas fa-eye me-1"></i> View sample report summary
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SummarizationForm;
