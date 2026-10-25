// components/ProgressBar.jsx
export default function ProgressBar({ percentage }) {
  const value = Math.max(0, Math.min(100, Number(percentage) || 0));
  return (
    <div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <p style={{ fontSize: 12, marginTop: 4 }}>{value}% complete</p>
    </div>
  );
}
