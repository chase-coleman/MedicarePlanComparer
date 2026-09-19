// A spinner for any pending request. `label` is what a screen reader
// announces and what sighted users read beneath the spinner, so it should say
// what is being fetched ("Loading plans") rather than just "Loading".
const LoaderComponent = ({ label = "Loading" }) => (
  <div className="loader" role="status" aria-live="polite">
    <span className="loader-spinner" aria-hidden="true" />
    <span className="loader-label">{label}</span>
  </div>
);

export default LoaderComponent;
