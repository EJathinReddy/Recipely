
export default function Loader() {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="loader-spinner"></div>
      <h3>Finding something delicious...</h3>
      <p>Preparing your recipe collection.</p>
    </div>
  );
}
