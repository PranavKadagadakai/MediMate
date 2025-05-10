function FeatureCard({ data }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 border-0 shadow-sm p-3">
        <div className="d-flex align-items-start">
          <div
            className="d-flex align-items-center justify-content-center me-3"
            style={{ width: "96px", height: "96px" }} // 3x container
          >
            {data.IconImgSrc ? (
              <img
                src={data.IconImgSrc}
                alt={data.IconImgAlt || "icon"}
                className="img-fluid"
                style={{ width: "72px", height: "72px" }} // 3x image
              />
            ) : (
              data.IconSvg && (
                <div style={{ width: "72px", height: "72px" }}>
                  {data.IconSvg}
                </div>
              )
            )}
          </div>
          <div>
            <h5 className="fw-semibold text-dark mb-2">{data.title}</h5>
            <p className="text-muted mb-2">{data.description}</p>
            <a
              href="#"
              className="text-primary text-decoration-none d-inline-flex align-items-center"
            >
              Learn More
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="ms-2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
