
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "translator", label: "Translator", icon: "scan" },
  { id: "demo-phrases", label: "Demo Phrases", icon: "hand" },
  { id: "builder", label: "Sentence Builder", icon: "message" },
  { id: "about", label: "About Project", icon: "layers" },
];

const DEMO_PHRASES = [
  {
    text: "HELLO",
    description: "A friendly greeting",
    icon: "hand",
  },
  {
    text: "THANK YOU",
    description: "Express gratitude",
    icon: "heart",
  },
  {
    text: "PLEASE",
    description: "Make a polite request",
    icon: "hand",
  },
  {
    text: "HELP",
    description: "Ask someone for assistance",
    icon: "heart",
  },
  {
    text: "HOW ARE YOU?",
    description: "Ask someone how they are doing",
    icon: "hand",
  },
  {
    text: "GOOD MORNING",
    description: "Greet someone in the morning",
    icon: "sun",
  },
  {
    text: "GOOD AFTERNOON",
    description: "Greet someone in the afternoon",
    icon: "sun",
  },
  {
    text: "GOOD EVENING",
    description: "Greet someone in the evening",
    icon: "sun",
  },
  {
    text: "GOOD NIGHT",
    description: "Wish someone a good night",
    icon: "moon",
  },
  {
    text: "NICE TO MEET YOU",
    description: "Introduce yourself politely",
    icon: "heart",
  },
  {
    text: "WHAT'S UP?",
    description: "Ask someone casually how things are",
    icon: "message",
  },
];

const ICON_PATHS = {
  grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  scan: ["M4 8V5a1 1 0 0 1 1-1h3", "M16 4h3a1 1 0 0 1 1 1v3", "M20 16v3a1 1 0 0 1-1 1h-3", "M8 20H5a1 1 0 0 1-1-1v-3", "M8 12h8"],
  message: ["M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"],
  layers: ["m12 3 9 5-9 5-9-5 9-5z", "m3 12 9 5 9-5", "m3 16 9 5 9-5"],
  hand: ["M8 12V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v8l1-3a2 2 0 0 1 4 1l-2 7a6 6 0 0 1-6 4h-3a6 6 0 0 1-5-3l-3-5a2 2 0 0 1 3-2l2 2"],
  heart: ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"],
  shield: ["M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z", "m9 12 2 2 4-4"],
  camera: ["M14 4h-4L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  play: ["m8 5 12 7-12 7z"],
  stop: ["M6 6h12v12H6z"],
  copy: ["M8 8V4h12v12h-4", "M4 8h12v12H4z"],
  undo: ["M9 14 4 9l5-5", "M4 9h10a6 6 0 0 1 0 12h-2"],
  trash: ["M3 6h18", "M8 6V4h8v2", "m19 6-1 14H6L5 6", "M10 11v5", "M14 11v5"],
  volume: ["M11 5 6 9H3v6h3l5 4z", "M15.5 8.5a5 5 0 0 1 0 7", "M19 5a10 10 0 0 1 0 14"],
  arrow: ["M5 12h14", "m12 5 7 7-7 7"],
  check: ["m5 12 4 4L19 6"],
  clock: ["M12 8v4l3 2", "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"],
  activity: ["M3 12h4l3-9 4 18 3-9h4"],
  sparkles: ["m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z", "m19 14 1.3 2.7L23 18l-2.7 1.3L19 22l-1.3-2.7L15 18l2.7-1.3L19 14z"],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  close: ["M18 6 6 18", "m6 6 12 12"],
  info: ["M12 16v-4", "M12 8h.01", "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"],
  sun: [
  "M12 3v2", "M12 19v2", "M5.64 5.64l1.42 1.42", "M16.94 16.94l1.42 1.42", "M3 12h2", "M19 12h2", "M5.64 18.36l1.42-1.42", "M16.94 7.06l1.42-1.42", "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",],
moon: ["M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z"],
};

function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(ICON_PATHS[name] || ICON_PATHS.sparkles).map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ children, variant = "neutral" }) {
  return <span className={`status-badge status-${variant}`}>{children}</span>;
}

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [sentenceWords, setSentenceWords] = useState([]);
  const [notice, setNotice] = useState("");
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const openDemoPhrases = () => {
    setActivePage("translator");
    setMobileNavOpen(false);

    window.setTimeout(() => {
      document
        .getElementById("demo-phrase-library")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 250);
  };

  const videoRef = useRef(null);
  const noticeTimerRef = useRef(null);

  const cameraActive = Boolean(cameraStream);

  const showNotice = useCallback((message) => {
    setNotice(message);
    window.clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = window.setTimeout(() => setNotice(""), 2600);
  }, []);

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return;

    const video = videoRef.current;
    video.srcObject = cameraStream;

    video.play().catch(() => {
      setCameraError(
        "The camera opened, but the video could not start. Check browser permissions."
      );
    });
  }, [cameraStream, activePage]);

  useEffect(() => {
    if (!cameraActive) return undefined;

    const interval = window.setInterval(() => {
      setSessionSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cameraActive]);

  useEffect(() => {
    return () => {
      window.clearTimeout(noticeTimerRef.current);

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const choosePage = (page) => {
  setActivePage(page);
  setMobileNavOpen(false);

  window.setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 100);
};

  const startCamera = async () => {
    if (cameraLoading || cameraActive) return;

    setCameraLoading(true);
    setCameraError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is unavailable. Open Signfy through localhost or HTTPS in a supported browser."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      setSessionCount((count) => count + 1);
      setSessionSeconds(0);

      // Automatically open Translator after the camera starts.
      setActivePage("translator");
      setMobileNavOpen(false);
    } catch (error) {
      let message =
        "Unable to access the camera. Check that it is connected and not being used by another application.";

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        message =
          "Camera permission was denied. Allow camera access in your browser's site settings and try again.";
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        message =
          "No camera was found. Connect a camera or check your Windows camera settings.";
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        message =
          "The camera is busy or unavailable. Close other camera applications and try again.";
      } else if (error.message) {
        message = error.message;
      }

      setCameraError(message);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    setCameraStream(null);
    setCameraError("");

    // Intentionally stay on the current page after stopping the camera.
  };

  const addToSentence = (phrase) => {
    setSentenceWords((current) => [...current, phrase]);
    showNotice(`Added "${phrase}" to your sentence`);
  };

  const undoSentence = () => {
    setSentenceWords((current) => current.slice(0, -1));
  };

  const clearSentence = () => {
    setSentenceWords([]);
  };

  const copySentence = async () => {
    const text = sentenceWords.join(" ").trim();

    if (!text) {
      showNotice("Build a sentence before copying");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showNotice("Sentence copied to clipboard");
    } catch {
      showNotice("Clipboard access failed. Check your browser permissions.");
    }
  };

  const speakSentence = () => {
    const text = sentenceWords.join(" ").trim();

    if (!text) {
      showNotice("Build a sentence before playing speech");
      return;
    }

    if (!("speechSynthesis" in window)) {
      showNotice("Text-to-speech is not supported in this browser");
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const renderCamera = (compact = false) => (
    <div className={`camera-frame ${compact ? "camera-compact" : ""}`}>
      {cameraActive ? (
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          muted
          playsInline
          aria-label="Live camera preview"
        />
      ) : (
        <div className="camera-placeholder">
          <div className="camera-orbit orbit-one" />
          <div className="camera-orbit orbit-two" />

          <div className="camera-placeholder-icon">
            <Icon name="camera" size={30} />
          </div>

          <h3>Your camera workspace</h3>
          <p>
            Position your hands inside the frame to prepare for translation.
          </p>

          {!compact && (
            <button
              className="button button-primary"
              onClick={startCamera}
              disabled={cameraLoading}
            >
              <Icon name="play" size={17} />
              {cameraLoading ? "Connecting..." : "Start camera"}
            </button>
          )}
        </div>
      )}

      <div className="camera-top-overlay">
        <span className="live-indicator">
          <span className={`live-dot ${cameraActive ? "dot-active" : ""}`} />
          {cameraActive ? "CAMERA LIVE" : "CAMERA OFF"}
        </span>

        <span className="camera-resolution">
          {cameraActive ? "LIVE PREVIEW" : "READY WHEN YOU ARE"}
        </span>
      </div>

      {cameraActive && (
        <div className="camera-bottom-overlay">
          <span>
            <Icon name="activity" size={15} /> Preview only
          </span>
          <span>{formatTime(sessionSeconds)}</span>
        </div>
      )}

      {cameraError && (
        <div className="camera-error">
          <Icon name="info" size={17} />
          <span>{cameraError}</span>
          <button
            className="icon-button error-dismiss"
            onClick={() => setCameraError("")}
            aria-label="Dismiss camera error"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const renderSentencePanel = () => (
    <section className="panel sentence-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title-row">
            <span className="panel-icon violet-icon">
              <Icon name="message" size={18} />
            </span>
            <h2>Sentence builder</h2>
          </div>
          <p className="panel-subtitle">
            Combine demo phrases into a sentence
          </p>
        </div>

        <span className="word-count">
          {sentenceWords.length}{" "}
          {sentenceWords.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div
        className={`sentence-canvas ${
          sentenceWords.length ? "sentence-filled" : ""
        }`}
      >
        {sentenceWords.length ? (
          <div className="sentence-chips">
            {sentenceWords.map((word, index) => (
              <span className="sentence-chip" key={`${word}-${index}`}>
                {word}
              </span>
            ))}
          </div>
        ) : (
          <div className="sentence-empty">
            <Icon name="message" size={24} />
            <span>Your sentence will appear here.</span>
            <small>Add a phrase from the demo library below.</small>
          </div>
        )}
      </div>

      <div className="sentence-actions">
        <button
          className="button button-secondary"
          onClick={undoSentence}
          disabled={!sentenceWords.length}
        >
          <Icon name="undo" size={16} /> Undo
        </button>

        <button
          className="button button-secondary"
          onClick={clearSentence}
          disabled={!sentenceWords.length}
        >
          <Icon name="trash" size={16} /> Clear
        </button>

        <div className="action-spacer" />

        <button className="button button-secondary" onClick={copySentence}>
          <Icon name="copy" size={16} /> Copy
        </button>

        <button className="button button-primary" onClick={speakSentence}>
          <Icon name="volume" size={16} /> Speak
        </button>
      </div>
    </section>
  );

  const renderPhraseLibrary = () => (
     <section className="panel" id="demo-phrase-library">
      <div className="panel-header">
        <div>
          <div className="panel-title-row">
            <span className="panel-icon blue-icon">
              <Icon name="hand" size={18} />
            </span>
            <h2>Demo phrase library</h2>
          </div>
          <p className="panel-subtitle">
            Select a phrase to preview it or add it to your sentence.
          </p>
        </div>

        <StatusBadge variant="demo">DEMO</StatusBadge>
      </div>

      <div className="phrase-grid">
        {DEMO_PHRASES.map((phrase) => (
          <button
            className={`phrase-card ${
              selectedDemo === phrase.text ? "phrase-selected" : ""
            }`}
            key={phrase.text}
            onClick={() => {
              setSelectedDemo(phrase.text);
              showNotice(`Demo phrase selected: ${phrase.text}`);
            }}
          >
            <span className="phrase-icon">
              <Icon name={phrase.icon} size={21} />
            </span>

            <span className="phrase-copy">
              <strong>{phrase.text}</strong>
              <small>{phrase.description}</small>
            </span>

            <Icon
              name="arrow"
              size={16}
              className="phrase-arrow"
            />
          </button>
        ))}
      </div>

      {selectedDemo && (
        <div className="demo-selection">
          <div>
            <span className="eyebrow">SELECTED DEMO PHRASE</span>
            <strong>{selectedDemo}</strong>
            <small>
              This is a sample input, not a model prediction.
            </small>
          </div>

          <button
            className="button button-primary"
            onClick={() => addToSentence(selectedDemo)}
          >
            Add to sentence <Icon name="arrow" size={16} />
          </button>
        </div>
      )}
    </section>
  );

  const renderOverview = () => (
    <>
      <SectionHeading
        eyebrow="YOUR WORKSPACE"
        title="Overview"
        description="Welcome to Signfy. Explore your sign language translation workspace."
        action={
          <button
            className="button button-primary"
            onClick={() => choosePage("translator")}
          >
            <Icon name="scan" size={17} /> Open translator
          </button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <span>Camera status</span>
            <span className="stat-icon">
              <Icon name="camera" />
            </span>
          </div>
          <div className="stat-value stat-value-small">
            {cameraActive ? "Connected" : "Inactive"}
          </div>
          <div className="stat-note">
            <span
              className={`mini-status ${
                cameraActive ? "mini-status-green" : ""
              }`}
            />
            {cameraActive ? "Preview is running" : "Start when you're ready"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Current session</span>
            <span className="stat-icon">
              <Icon name="clock" />
            </span>
          </div>
          <div className="stat-value">
            {cameraActive ? formatTime(sessionSeconds) : "00:00"}
          </div>
          <div className="stat-note">Time in current camera session</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Demo phrases</span>
            <span className="stat-icon">
              <Icon name="hand" />
            </span>
          </div>
          <div className="stat-value">
          {String(DEMO_PHRASES.length).padStart(2, "0")}
          </div>
          <div className="stat-note">Sample inputs available</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Recognition engine</span>
            <span className="stat-icon">
              <Icon name="activity" />
            </span>
          </div>
          <div className="stat-value stat-value-small">Not connected</div>
          <div className="stat-note">
            <span className="mini-status mini-status-amber" />
            AI integration pending
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <section className="panel overview-camera-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <span className="panel-icon blue-icon">
                  <Icon name="camera" />
                </span>
                <h2>Camera workspace</h2>
              </div>
              <p className="panel-subtitle">
                Live preview from your selected camera.
              </p>
            </div>

            <StatusBadge variant={cameraActive ? "success" : "neutral"}>
              {cameraActive ? "LIVE" : "STANDBY"}
            </StatusBadge>
          </div>

          {renderCamera(true)}

          <div className="camera-actions">
            {cameraActive ? (
              <button className="button button-danger" onClick={stopCamera}>
                <Icon name="stop" size={16} /> Stop camera
              </button>
            ) : (
              <button
                className="button button-primary"
                onClick={startCamera}
                disabled={cameraLoading}
              >
                <Icon name="play" size={16} />
                {cameraLoading ? "Connecting..." : "Start camera"}
              </button>
            )}

            <button
              className="button button-secondary"
              onClick={() => choosePage("translator")}
            >
              Open translator <Icon name="arrow" size={16} />
            </button>
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <span className="panel-icon violet-icon">
                  <Icon name="sparkles" />
                </span>
                <h2>Getting started</h2>
              </div>
              <p className="panel-subtitle">Your path through Signfy.</p>
            </div>
          </div>

          <div className="getting-started-list">
            <div className="getting-started-item">
              <span className="step-number">01</span>
              <div>
                <strong>Enable your camera</strong>
                <p>Allow browser access and check your framing.</p>
              </div>
              <Icon
                name={cameraActive ? "check" : "camera"}
                size={18}
                className="step-trailing"
              />
            </div>

            <div className="getting-started-item">
              <span className="step-number">02</span>
              <div>
                <strong>Explore demo phrases</strong>
                <p>
                  Try the sample phrase library and sentence builder.
                </p>
              </div>
              <Icon
                name="message"
                size={18}
                className="step-trailing"
              />
            </div>

            <div className="getting-started-item">
              <span className="step-number">03</span>
              <div>
                <strong>Connect the AI model</strong>
                <p>
                  Integrate the trained recognition pipeline when ready.
                </p>
              </div>
              <StatusBadge variant="warning">PENDING</StatusBadge>
            </div>
          </div>

          <div className="info-banner">
            <Icon name="info" size={18} />
            <p>
              The camera currently provides a live preview only. Live sign
              recognition is not yet connected.
            </p>
          </div>
        </section>
      </div>

      {renderPhraseLibrary()}
    </>
  );

  const renderTranslator = () => (
    <>
      <SectionHeading
        eyebrow="LIVE WORKSPACE"
        title="Sign translator"
        description="Prepare your camera and explore the translation interface."
        action={<StatusBadge variant="demo">PREVIEW MODE</StatusBadge>}
      />

      <div className="translator-layout">
        <section className="panel translator-camera-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title-row">
                <span className="panel-icon blue-icon">
                  <Icon name="camera" />
                </span>
                <h2>Camera input</h2>
              </div>
              <p className="panel-subtitle">
                Keep your hands visible and well lit.
              </p>
            </div>

            <StatusBadge variant={cameraActive ? "success" : "neutral"}>
              {cameraActive ? "LIVE" : "OFFLINE"}
            </StatusBadge>
          </div>

          {renderCamera()}

          <div className="camera-actions">
            {cameraActive ? (
              <button className="button button-danger" onClick={stopCamera}>
                <Icon name="stop" size={16} /> Stop camera
              </button>
            ) : (
              <button
                className="button button-primary"
                onClick={startCamera}
                disabled={cameraLoading}
              >
                <Icon name="play" size={16} />
                {cameraLoading ? "Connecting..." : "Start camera"}
              </button>
            )}

            <span className="camera-hint">
              <Icon name="shield" size={15} /> Browser camera access required
            </span>
          </div>

          <div className="camera-guidance">
            <strong>
              <Icon name="info" size={16} /> For best framing
            </strong>
            <span>
              Use a well-lit space, keep your hands inside the frame, and
              position the camera at a comfortable distance.
            </span>
          </div>
        </section>

        <div className="translator-right-column">
          <section className="panel output-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title-row">
                  <span className="panel-icon violet-icon">
                    <Icon name="activity" />
                  </span>
                  <h2>Recognized output</h2>
                </div>
                <p className="panel-subtitle">Translation result area</p>
              </div>

              <StatusBadge variant="warning">NOT CONNECTED</StatusBadge>
            </div>

            <div className="output-placeholder">
              <div className="output-symbol">
                <Icon name="scan" size={28} />
              </div>
              <strong>Waiting for AI integration</strong>
              <p>
                Live predictions will appear here once the sign-recognition
                model is connected.
              </p>

              {selectedDemo && (
                <div className="selected-demo-output">
                  <span>Last selected demo</span>
                  <strong>{selectedDemo}</strong>
                </div>
              )}
            </div>

            <div className="output-footer">
              <span className="mini-status mini-status-amber" />
              No live predictions are being generated
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title-row">
                  <span className="panel-icon blue-icon">
                    <Icon name="hand" />
                  </span>
                  <h2>Try a demo input</h2>
                </div>
                <p className="panel-subtitle">
                  Use sample phrases to test the interface.
                </p>
              </div>
            </div>

            <div className="demo-quick-list">
              {DEMO_PHRASES.map((phrase) => (
                <button
                  className={`demo-quick-item ${
                    selectedDemo === phrase.text ? "quick-selected" : ""
                  }`}
                  key={phrase.text}
                  onClick={() => {
                    setSelectedDemo(phrase.text);
                    showNotice(
                      `${phrase.text} selected — demo input only`
                    );
                  }}
                >
                  <span>{phrase.text}</span>
                  <Icon
                    name={selectedDemo === phrase.text ? "check" : "arrow"}
                    size={16}
                  />
                </button>
              ))}
            </div>

            {selectedDemo && (
              <button
                className="button button-primary button-full"
                onClick={() => addToSentence(selectedDemo)}
              >
                Add {selectedDemo} to sentence{" "}
                <Icon name="arrow" size={16} />
              </button>
            )}

            <p className="demo-disclaimer">
              These phrases are manually selected demonstration inputs, not
              camera-based predictions.
            </p>
          </section>
        </div>
      </div>

      {renderSentencePanel()}
      {renderPhraseLibrary()}
    </>
  );

  const renderBuilder = () => (
    <>
      <SectionHeading
        eyebrow="COMPOSE & COMMUNICATE"
        title="Sentence builder"
        description="Combine phrases, review your message, and use browser text-to-speech."
        action={<StatusBadge variant="demo">DEMO INPUTS</StatusBadge>}
      />

      {renderSentencePanel()}
      {renderPhraseLibrary()}

      <section className="panel builder-tips">
        <div className="panel-title-row">
          <span className="panel-icon violet-icon">
            <Icon name="volume" />
          </span>
          <h2>Communication tools</h2>
        </div>

        <div className="tips-grid">
          <div>
            <strong>Copy your sentence</strong>
            <p>
              Copy the assembled text for use in another application.
            </p>
          </div>
          <div>
            <strong>Speak your sentence</strong>
            <p>
              Uses your browser's speech synthesis. Voice availability depends
              on your device.
            </p>
          </div>
          <div>
            <strong>Undo and clear</strong>
            <p>Remove the most recent phrase or start a new sentence.</p>
          </div>
        </div>
      </section>
    </>
  );

  const renderAbout = () => (
    <>
      <SectionHeading
        eyebrow="THE PROJECT"
        title="About Signfy"
        description="An AI-assisted sign language translation project designed to make communication more accessible."
      />

      <section className="about-hero panel">
        <div className="about-hero-content">
          <div className="brand-mark brand-mark-large">
            <Icon name="hand" size={31} />
          </div>
          <span className="eyebrow">AI-POWERED COMMUNICATION</span>
          <h2>
            Bridging communication
            <br />
            through intelligent technology.
          </h2>
          <p>
            Signfy is designed to explore how computer vision and machine
            learning can help interpret sign language and present recognized
            content as readable text.
          </p>
          <StatusBadge variant="demo">ACTIVE DEVELOPMENT</StatusBadge>
        </div>

        <div className="about-orbit-art" aria-hidden="true">
          <div className="about-orbit-circle circle-a" />
          <div className="about-orbit-circle circle-b" />
          <div className="about-orbit-circle circle-c">
            <Icon name="hand" size={43} />
          </div>
        </div>
      </section>

      <div className="about-cards-grid">
        <section className="panel">
          <span className="panel-icon blue-icon">
            <Icon name="scan" size={20} />
          </span>
          <h3>Computer vision</h3>
          <p>
            Capture camera frames and process visual hand information for
            recognition.
          </p>
        </section>

        <section className="panel">
          <span className="panel-icon violet-icon">
            <Icon name="activity" size={20} />
          </span>
          <h3>Machine learning</h3>
          <p>
            Use a trained model to classify signs and, as the system develops,
            interpret sequential inputs.
          </p>
        </section>

        <section className="panel">
          <span className="panel-icon blue-icon">
            <Icon name="message" size={20} />
          </span>
          <h3>Text & speech</h3>
          <p>
            Present recognized text and support sentence composition and
            browser-based speech output.
          </p>
        </section>
      </div>

      <section className="panel workflow-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title-row">
              <span className="panel-icon violet-icon">
                <Icon name="layers" />
              </span>
              <h2>Proposed workflow</h2>
            </div>
            <p className="panel-subtitle">
              The intended recognition pipeline.
            </p>
          </div>
        </div>

        <div className="workflow-steps">
          {[
            ["01", "Camera input", "Capture video frames"],
            ["02", "Preprocessing", "Prepare visual data"],
            ["03", "Hand / sign analysis", "Extract useful features"],
            ["04", "Model inference", "Predict recognized signs"],
            ["05", "Text formation", "Build readable output"],
            ["06", "Speech output", "Optional spoken text"],
          ].map(([number, title, detail], index) => (
            <div className="workflow-step" key={number}>
              <span className="workflow-number">{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{detail}</p>
              </div>
              {index < 5 && (
                <Icon name="arrow" size={16} className="workflow-arrow" />
              )}
            </div>
          ))}
        </div>

        <div className="info-banner">
          <Icon name="info" size={18} />
          <p>
            This is the proposed workflow. The current frontend implements
            camera preview and demo text composition; the complete inference
            pipeline remains to be integrated and validated.
          </p>
        </div>
      </section>

      <section className="panel project-status-panel">
        <div className="panel-header">
          <div>
            <div className="panel-title-row">
              <span className="panel-icon blue-icon">
                <Icon name="activity" />
              </span>
              <h2>Implementation status</h2>
            </div>
            <p className="panel-subtitle">
              Current frontend capabilities at a glance.
            </p>
          </div>
        </div>

        <div className="status-list">
          {[
            ["React interface and navigation", "Implemented", "success"],
            ["Live camera preview", "Implemented", "success"],
            ["Demo phrase and sentence tools", "Implemented", "success"],
            ["Trained model integration", "Pending", "warning"],
            ["Live sign-to-text predictions", "Pending", "warning"],
          ].map(([label, status, variant]) => (
            <div className="status-list-row" key={label}>
              <span>{label}</span>
              <StatusBadge variant={variant}>{status}</StatusBadge>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <button
            className="brand-home-button"
            onClick={() => choosePage("overview")}
            aria-label="Go to Signfy overview"
            title="Go to Overview"
          >
            <div className="brand-mark">
              <Icon name="hand" size={24} />
            </div>

            <div className="brand-copy">
              <strong>
                signfy<span>.</span>
              </strong>
              <small>INTELLIGENT COMMUNICATION</small>
            </div>
          </button>

          <button
            className="icon-button mobile-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              className={`nav-item ${
                activePage === item.id ? "nav-item-active" : ""
              }`}
              key={item.id}
              onClick={() => {
              if (item.id === "demo-phrases") {
                openDemoPhrases();
              } else {
                choosePage(item.id);
              }
            }}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.id === "translator" && <span className="nav-live-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-project-card">
          <div className="project-card-top">
            <span className="project-card-icon">
              <Icon name="sparkles" size={18} />
            </span>
            <StatusBadge variant="demo">BETA</StatusBadge>
          </div>

          <strong>Built for better communication.</strong>
          <p>Signfy's recognition engine is under development.</p>

          <button onClick={() => choosePage("about")}>
            Explore the project <Icon name="arrow" size={14} />
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Icon name="menu" />
            </button>

            <div className="breadcrumb">
              <strong>
                {NAV_ITEMS.find((item) => item.id === activePage)?.label}
              </strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="environment-label">
              <span className="environment-dot" />
              Local environment
            </span>

            <div className="topbar-divider" />

            <div className="topbar-project">
              <div className="topbar-project-icon">
                <Icon name="layers" size={17} />
              </div>
              <span>
                Signfy <small>v1.0</small>
              </span>
            </div>
          </div>
        </header>

        <div className="page-content" key={activePage}>
          {activePage === "overview" && renderOverview()}
          {activePage === "translator" && renderTranslator()}
          {activePage === "builder" && renderBuilder()}
          {activePage === "about" && renderAbout()}

          <footer className="app-footer">
            <span>© 2026 Signfy · AI-powered sign language translation</span>
            <span>
              <span className="footer-dot" />
              Frontend development build
            </span>
          </footer>
        </div>
      </main>

      {notice && (
        <div className="toast-notice" role="status">
          <span className="toast-check">
            <Icon name="check" size={16} />
          </span>
          {notice}
        </div>
      )}
    </div>
  );
}
