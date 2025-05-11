function TestimonialCard({ data }) {
  return (
    <div className="card h-100 border-0 shadow-sm p-3">
      <div className="card-body bg-light rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="mb-3"
          width="24"
          height="24"
          viewBox="0 0 975.036 975.036"
        >
          <path d="M925.036..."></path>
        </svg>

        <p className="card-text mb-4">{data.description}</p>

        <div className="d-flex align-items-center">
          <img
            alt="testimonial"
            src={data.ImgSrc}
            className="rounded-circle me-3"
            width="48"
            height="48"
          />
          <div>
            <h6 className="mb-0 fw-semibold">{data.name}</h6>
            <small className="text-muted">{data.designation}</small>
            <div className="mt-2 d-flex gap-2">
              <a
                href={data.social_links.instagram}
                className="text-muted"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href={data.social_links.github}
                className="text-muted"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href={data.social_links.linkedin}
                className="text-muted"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
