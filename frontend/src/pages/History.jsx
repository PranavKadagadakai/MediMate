import React, { useState, useEffect } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";
import { useProfile } from "../context/ProfileContext";

function History() {
  const { profile } = useProfile();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    entry_type: "symptom",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchEntries = async () => {
    try {
      const res = await api.get("/api/tracker/entries/");
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch medical entries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === "patient") {
      fetchEntries();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      await api.post("/api/tracker/entries/", dataToSubmit);
      fetchEntries(); // Refresh list
      setFormData({
        entry_type: "symptom",
        description: "",
        date: new Date().toISOString().split("T")[0],
      }); // Reset form
    } catch (error) {
      console.error("Failed to add entry", error);
      alert("Failed to add entry. Please try again.");
    }
  };

  if (profile?.role !== "patient") {
    return (
      <div className="alert alert-warning">
        This feature is available for patients only.
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h2 className="h5 mb-0">
                <i className="bi bi-journal-plus me-2"></i>Add Medical Entry
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="entry_type" className="form-label">
                    Entry Type
                  </label>
                  <select
                    name="entry_type"
                    id="entry_type"
                    className="form-select"
                    value={formData.entry_type}
                    onChange={handleChange}
                  >
                    <option value="symptom">Symptom</option>
                    <option value="medication">Medication</option>
                    <option value="diagnosis">Diagnosis</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Add Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-secondary text-white">
              <h2 className="h5 mb-0">
                <i className="bi bi-list-ul me-2"></i>Recent History
              </h2>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {loading ? (
                <LoadingIndicator />
              ) : entries.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {entries.map((entry) => (
                    <li key={entry.id} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1 text-capitalize">
                          {entry.entry_type}
                        </h6>
                        <small>
                          {new Date(entry.date).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-1">{entry.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center">
                  No history entries yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
