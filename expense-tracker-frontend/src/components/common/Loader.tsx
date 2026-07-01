export const Loader = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="loader-card">
    <span className="loader" />
    <span>{label}</span>
  </div>
);
