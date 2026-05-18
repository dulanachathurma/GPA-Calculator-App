export default function GPADisplay({ label, value, cls, pulse, sub, large, isNum }) {
  const display = isNum ? value : value.toFixed(2);
  return (
    <div className={`stat-card ${cls} ${large ? "stat-card--large" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${pulse ? "stat-pulse" : ""}`}>{display}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}
