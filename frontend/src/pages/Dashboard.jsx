import { useProfile } from "../context/ProfileContext.jsx";
import DashboardFeatureCard from "../components/DashboardFeatureCard.jsx";
import LoadingIndicator from "../components/LoadingIndicator.jsx";

const Dashboard = () => {
  const { profile, loading } = useProfile();

  const doctorFeatures = [
    {
      title: "Summarizer",
      text: "Quick summaries of reports, prescriptions, or chat history.",
      path: "/summarize",
      linkText: "Summarize Now",
    },
    {
      title: "Forum",
      text: "Share and discuss medical cases and research securely.",
      path: "/forum",
      linkText: "Go to Forum",
    },
    {
      title: "Secure Messaging",
      text: "Encrypted real-time communication with patients.",
      path: "/messenger",
      linkText: "Open Messenger",
    },
  ];

  const patientFeatures = [
    {
      title: "AI Chatbot",
      text: "Get instant answers to your health-related queries.",
      path: "/chatbot",
      linkText: "Open Chatbot",
    },
    {
      title: "Text-to-Speech",
      text: "Convert health info or reports to speech easily.",
      path: "/translate",
      linkText: "Listen Now",
    },
    {
      title: "Summarizer",
      text: "Get easy-to-read summaries of prescriptions and reports.",
      path: "/summarize",
      linkText: "Summarize Now",
    },
    {
      title: "Messaging",
      text: "Chat with your assigned doctor anytime.",
      path: "/messenger",
      linkText: "Message Now",
    },
    {
      title: "Health Tracker",
      text: "Track your appointments, prescriptions, and recovery progress.",
      path: "/history",
      linkText: "Track Progress",
    },
  ];

  if (loading) {
    return (
      <div className="text-center mt-5">
        <LoadingIndicator />
      </div>
    );
  }

  const { username, role } = profile || {};

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h6 className="text-primary text-uppercase">MediMate</h6>
          <h2 className="fw-bold">Doctor-Patient Communication Dashboard</h2>
          <p className="text-muted">
            Empowering seamless and intelligent healthcare communication through
            AI-driven tools.
          </p>
          <h4 className="text-dark mt-4">Welcome, {username}!</h4>
        </div>
        <div className="row g-4">
          {role === "doctor" ? (
            doctorFeatures.map((feature, index) => (
              <DashboardFeatureCard key={index} featureData={feature} />
            ))
          ) : role === "patient" ? (
            patientFeatures.map((feature, index) => (
              <DashboardFeatureCard key={index} featureData={feature} />
            ))
          ) : (
            <p>No features available for your role.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
