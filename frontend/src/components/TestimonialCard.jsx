function TestimonialCard({ data }) {
  return (
    <div className="card h-100 border-0 shadow-sm p-3">
      <div className="card-body bg-light rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-quote mb-3"
          width="24"
          height="24"
          // ✨ FIX: Corrected viewBox to match the icon's coordinate system.
          viewBox="0 0 16 16"
        >
          <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3.573q-.43.03-.816.03-1.09 0-1.94.422t-1.287 1.335q-.63.974-.968 2.224zM6 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992t.559-.683q.34-.279.868-.279V3.573q-.43.03-.816.03-1.09 0-1.94.422T.83 6.33q-.63.974-.968 2.224z"></path>
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
