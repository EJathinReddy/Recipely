
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container" role="alert">
      <span className="error-emoji">🍽️</span>
      <h3>Oops! Nothing on the menu.</h3>
      <p>{message}</p>
      <button className="primary-button" onClick={onRetry}>
        Try Again ↻
      </button>
    </div>
  );
}
