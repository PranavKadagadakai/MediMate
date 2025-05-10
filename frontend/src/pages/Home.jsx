import TestimonialCard from "../components/TestimonialCard";
import FeatureCard from "../components/FeatureCard";
import TranslateIcon from "../assets/translate.svg";
import SummaryIcon from "../assets/summary.svg";
import { Link } from "react-router-dom";

function Home() {
  const testimonialCardData = [
    {
      ImgSrc: "https://dummyimage.com/106x106",
      name: "Pranav S K",
      designation: "Developer",
      social_links: {
        instagram: "#",
        github: "https://github.com/PranavKadagadakai",
        linkedin: "https://www.linkedin.com/in/pranav-kadagadakai-008b531ba/",
      },
    },
    {
      ImgSrc: "https://dummyimage.com/106x106",
      name: "Soumya Shetty",
      designation: "Designer",
      social_links: {
        instagram: "#",
        github: "#",
        linkedin: "https://www.linkedin.com/in/soumya-huchanur-235b2929b/",
      },
    },
    {
      ImgSrc: "https://dummyimage.com/106x106",
      name: "Anuj Bagewadi",
      designation: "Developer",
      social_links: {
        instagram: "#",
        github: "https://github.com/AnujBagewadi",
        linkedin: "https://www.linkedin.com/in/anuj-bagewadi-a3152a247/",
      },
    },
    {
      ImgSrc: "https://dummyimage.com/106x106",
      name: "Manoranjini",
      designation: "Designer",
      social_links: {
        instagram: "#",
        github: "https://github.com/ManoranjiniChandargi",
        linkedin: "https://www.linkedin.com/in/manoranjinichandargi",
      },
    },
  ];

  const featureCardData = [
    {
      IconImgSrc:
        "https://www.svgrepo.com/show/159712/male-head-side-view-with-brains.svg",
      IconImgAlt: "AI Brain Icon",
      title: "AI-Powered Medical Chatbot",
      description:
        "A 24/7 multilingual assistant that responds to patient questions about symptoms, test results, medications, and procedures.\nUtilizes Google Gemini AI for safe, empathetic, and medically-aware conversations — with built-in disclaimers and escalation.",
    },
    {
      IconImgSrc: SummaryIcon,
      IconImgAlt: "Summarizer Icon",
      title: "Medical Report Summarizer",
      description:
        "Upload PDFs, DOCX or TXT files and get simplified summaries of diagnoses, treatments, and recommendations.\nDesigned for patients to understand clinical information without medical jargon — powered by Transformer-based models.",
    },
    {
      IconImgSrc:
        "https://www.svgrepo.com/show/533266/message-square-lines.svg",
      IconImgAlt: "Message Icon",
      title: "Secure Messaging & Health Forum",
      description:
        "Patients and doctors can message directly or post in a health-focused forum.\nSupport peer-to-peer engagement, Q&A, and community health discussions — all within a role-aware and secure messaging system.",
    },
    // {
    //   IconImgSrc: "https://www.svgrepo.com/show/511824/calendar-clock.svg",
    //   IconImgAlt: "Calendar Icon",
    //   title: "Health Tracker & Appointment Scheduler",
    //   description:
    //     "Track appointments, treatments, symptoms, and medications in one place.\nAutomate reminders and calendar sync. Designed to reduce missed appointments and empower patient self-care.",
    // },
    {
      IconImgSrc: TranslateIcon,
      IconImgAlt: "Translate Icon",
      title: "Voice Translation & TTS",
      description:
        "Converts medical instructions or summaries into regional languages — with support for text-to-speech playback.\nUseful for patients with low literacy, older adults, or when bridging language barriers during care.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="text-dark py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-start">
            {/* Text content */}
            <div className="col-md-6 mb-4">
              <h1 className="display-5 fw-bold mb-4">
                AI Enhanced Health Communication System
              </h1>
              <p className="lead mb-3">
                An AI-powered communication platform designed to streamline and
                personalize interactions between patients and healthcare
                providers. By leveraging natural language processing and
                real-time data analytics, the system ensures accurate,
                empathetic, and timely communication.
              </p>
              <p className="lead mb-4">
                The solution enhances patient engagement, supports better
                decision-making for doctors, and fosters a more connected,
                efficient healthcare experience. Secure, intelligent, and
                intuitive—this system transforms the way care is delivered and
                received.
              </p>
              <Link to="/register">
                <button className="btn btn-primary btn-lg">Get Started</button>
              </Link>
            </div>

            {/* Image */}
            <div className="col-md-6 text-center">
              <img
                src="/images/Checkup.jpeg"
                alt="Doctor and Patient"
                className="img-fluid rounded shadow"
                width="600"
                height="600"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="bg-light py-5 text-dark">
        <div className="container">
          <h1 className="text-center mb-4 display-6 fw-semibold">
            Testimonials
          </h1>
          <div className="row gy-4">
            {testimonialCardData.map((data, index) => (
              <div className="col-md-6" key={index}>
                <TestimonialCard data={data} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-5 text-dark">
        <div className="container">
          <h1 className="text-center mb-5 display-6 fw-semibold">
            Core Features
          </h1>
          <div className="row">
            {featureCardData.map((data, index) => (
              <FeatureCard key={index} data={data} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-light text-muted pt-5">
        <div className="container">
          <div className="row">
            {/* Categories Section */}
            <div className="col-md-6 col-lg-3 mb-4">
              <h6 className="text-uppercase fw-bold mb-3 text-dark">
                Categories
              </h6>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="#"
                    className="text-muted text-decoration-none d-block mb-2"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted text-decoration-none d-block mb-2"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted text-decoration-none d-block"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Subscribe Section */}
            <div className="col-md-6 col-lg-3 mb-4">
              <h6 className="text-uppercase fw-bold mb-3 text-dark">
                Subscribe
              </h6>
              <form className="d-flex flex-column">
                <label htmlFor="footer-field" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="footer-field"
                  className="form-control mb-2"
                  placeholder="Enter your email"
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-secondary bg-opacity-10 py-3 mt-4">
          <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
            {/* Logo and Brand */}
            <a
              href="#"
              className="d-flex align-items-center text-dark text-decoration-none mb-3 mb-md-0"
            >
              <div
                className="bg-primary text-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="bi bi-box"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="fs-5 fw-bold">MediMate</span>
            </a>

            {/* Copyright */}
            <p className="text-muted mb-0 small">© 2025 KLS GIT</p>

            {/* Social Icons */}
            <div className="d-flex mt-3 mt-md-0">
              <a href="#" className="text-muted me-3">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-muted me-3">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
