import React, { useState } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function Translate() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const response = await api.post(
        "/api/translate/translate/",
        { text, target_lang: targetLang },
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      setError("Failed to translate or generate speech. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "kn", name: "Kannada" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
  ];

  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0">
            <i className="bi bi-translate me-2"></i>Translate + Text-to-Speech
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="input-text" className="form-label">
                Enter Text:
              </label>
              <textarea
                className="form-control"
                id="input-text"
                rows="5"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="target-lang" className="form-label">
                Target Language:
              </label>
              <select
                className="form-select"
                id="target-lang"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
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
                    <i className="bi bi-mic-fill me-1"></i> Translate & Speak
                  </>
                )}
              </button>
            </div>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {audioUrl && (
            <div className="mt-3">
              <audio controls src={audioUrl} className="w-100">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Translate;
