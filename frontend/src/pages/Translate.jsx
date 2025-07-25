import React, { useState, useEffect } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

// Sub-component for language panels (No changes needed here, shown for context)
const LanguagePanel = ({
  lang,
  setLang,
  text,
  setText,
  languages,
  isSource,
  onCopy,
  onListen,
  onSpeak,
  isListening,
  recognitionSupported,
  isLoading,
}) => (
  <div className="border rounded p-3 h-100 d-flex flex-column">
    <select
      className="form-select mb-2"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.name}
        </option>
      ))}
    </select>
    <div className="flex-grow-1 position-relative">
      <textarea
        className="form-control h-100"
        style={{ minHeight: "150px", resize: "none" }}
        value={text}
        onChange={isSource ? (e) => setText(e.target.value) : undefined}
        readOnly={!isSource}
        placeholder={
          isSource ? "Enter text or use microphone..." : "Translation..."
        }
      />
      {isLoading && !isSource && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <LoadingIndicator />
        </div>
      )}
    </div>
    <div className="d-flex justify-content-end align-items-center mt-2 gap-2">
      {text && (
        <>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onSpeak(text, lang)}
            title="Listen"
          >
            <i className="bi bi-volume-up"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onCopy(text)}
            title="Copy"
          >
            <i className="bi bi-clipboard"></i>
          </button>
        </>
      )}
      {isSource && recognitionSupported && (
        <button
          className={`btn btn-sm ${
            isListening ? "btn-danger" : "btn-outline-primary"
          }`}
          onClick={onListen}
          title="Use Microphone"
        >
          <i className="bi bi-mic-fill"></i>
        </button>
      )}
    </div>
  </div>
);

// Main Translate component
function Translate() {
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }

    recognition.lang = sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setSourceText(spokenText);
      handleTranslate(spokenText, sourceLang, targetLang);
      setIsListening(false);
    };

    // Improved error handling for speech recognition
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      let message = "An unknown speech recognition error occurred.";
      if (event.error === "network") {
        message =
          "Speech recognition failed due to a network issue. Please check your connection.";
      } else if (event.error === "no-speech") {
        message = "No speech was detected. Please try again.";
      } else if (event.error === "audio-capture") {
        message =
          "Could not access the microphone. Please check your microphone permissions.";
      } else if (event.error === "not-allowed") {
        message =
          "Microphone access was denied. Please allow microphone access in your browser settings.";
      }
      setError(message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    // The recognition service only needs to be updated when the source language changes.
  }, [recognition, sourceLang]);

  const toggleListen = () => {
    if (isListening) {
      recognition.stop();
    } else {
      if (!sourceText) setTargetText("");
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const handleTranslate = async (
    textToTranslate = sourceText,
    src = sourceLang,
    dest = targetLang
  ) => {
    if (!textToTranslate.trim()) return;

    setLoading(true);
    setError("");
    setTargetText("");

    try {
      const response = await api.post("/api/translate/translate/", {
        text: textToTranslate,
        source_lang: src,
        target_lang: dest,
      });

      const { translated_text, audio_base64 } = response.data;
      setTargetText(translated_text);

      const audio = new Audio(`data:audio/mpeg;base64,${audio_base64}`);
      audio.play();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to translate. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  const handleCopyToClipboard = (text) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Text copied to clipboard!");
      });
    }
  };

  const playTextAsSpeech = (text, lang) => {
    if (!text || loading) return;
    handleTranslate(text, lang, lang);
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "kn", name: "Kannada" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "bn", name: "Bengali" },
    { code: "gu", name: "Gujarati" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
  ];

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "900px" }}>
        <div className="card-header bg-primary text-white">
          <h2 className="h5 mb-0 d-flex align-items-center">
            <i className="bi bi-translate me-2"></i> Translator with Speech
          </h2>
        </div>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <LanguagePanel
                lang={sourceLang}
                setLang={setSourceLang}
                text={sourceText}
                setText={setSourceText}
                languages={languages}
                isSource={true}
                onCopy={handleCopyToClipboard}
                onListen={toggleListen}
                onSpeak={playTextAsSpeech}
                isListening={isListening}
                recognitionSupported={!!recognition}
              />
            </div>
            <div className="col-md-6">
              <LanguagePanel
                lang={targetLang}
                setLang={setTargetLang}
                text={targetText}
                languages={languages}
                isSource={false}
                onCopy={handleCopyToClipboard}
                onSpeak={playTextAsSpeech}
                isLoading={loading}
              />
            </div>
          </div>
          <div className="text-center my-3">
            <button
              className="btn btn-light border"
              onClick={handleSwapLanguages}
              title="Swap Languages"
            >
              <i className="bi bi-arrow-left-right"></i>
            </button>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => handleTranslate()}
              disabled={loading || !sourceText}
            >
              {loading ? (
                <LoadingIndicator />
              ) : (
                <>
                  <i className="bi bi-mic-fill me-1"></i> Translate & Speak
                </>
              )}
            </button>
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
        <div className="card-footer text-muted small">
          <i className="bi bi-info-circle me-1"></i>
          Speech-to-Text is handled by your browser. Translation and
          Text-to-Speech are handled by our server.
        </div>
      </div>
    </div>
  );
}

export default Translate;
