import { Link } from "react-router-dom";

function DashboardFeatureCard({ featureData }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body text-center">
          <h5 className="card-title">{featureData.title}</h5>
          <p className="card-text text-muted">{featureData.text}</p>
          <Link to={featureData.path} className="text-decoration-none">
            {featureData.linkText}
            <svg
              className="w-1 h-1 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              height={24}
              width={24}
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardFeatureCard;
