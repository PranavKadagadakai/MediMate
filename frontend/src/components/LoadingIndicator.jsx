const LoadingIndicator = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
