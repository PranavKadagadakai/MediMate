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
  // For doctor: patient selection
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  const fetchEntries = async (patientId = null) => {
    setLoading(true);
    try {
      let url = "/api/tracker/entries/";
      if (profile?.role === "doctor" && patientId) {
        url += `?patient_id=${patientId}`;
      }
      const res = await api.get(url);
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch medical entries", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients for doctor
  useEffect(() => {
    if (profile?.role === "doctor") {
      api
        .get("/api/auth/patients/")
        .then((res) => setPatients(res.data))
        .catch((err) => setPatients([]));
    }
  }, [profile]);

  // Fetch entries for patient or selected patient
  useEffect(() => {
    if (profile?.role === "patient") {
      fetchEntries();
    } else if (profile?.role === "doctor" && selectedPatient) {
      fetchEntries(selectedPatient);
    } else {
      setLoading(false);
    }
  }, [profile, selectedPatient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile?.role !== "doctor" || !selectedPatient) return;
    try {
      const dataToSubmit = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        patient_id: selectedPatient,
      };
      await api.post("/api/tracker/entries/", dataToSubmit);
      fetchEntries(selectedPatient); // Refresh list
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

  if (profile?.role === "doctor") {
    return (
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h2 className="h5 mb-0">
                  <i className="bi bi-person me-2"></i>Select Patient
                </h2>
              </div>
              <div className="card-body">
                <label htmlFor="patient-select" className="form-label">
                  Patient
                </label>
                <select
                  id="patient-select"
                  className="form-select"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name || p.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-secondary text-white">
                <h2 className="h5 mb-0">
                  <i className="bi bi-list-ul me-2"></i>Patient History
                </h2>
              </div>
              <div
                className="card-body"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {/* Only show add entry form if a patient is selected */}
                {selectedPatient && (
                  <form onSubmit={handleSubmit} className="mt-4">
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
                )}
                {loading ? (
                  <LoadingIndicator />
                ) : selectedPatient && entries.length > 0 ? (
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
                ) : selectedPatient ? (
                  <p className="text-muted text-center">
                    No history entries yet.
                  </p>
                ) : (
                  <p className="text-muted text-center">
                    Select a patient to view history.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Patient view: read-only history
  if (profile?.role === "patient") {
    return (
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-12">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-secondary text-white">
                <h2 className="h5 mb-0">
                  <i className="bi bi-list-ul me-2"></i>Your Medical History
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
}

export default History;
