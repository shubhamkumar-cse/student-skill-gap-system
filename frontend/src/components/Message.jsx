// components/Message.jsx
// Small banner used for error / success feedback across forms and pages.
export default function Message({ type = "error", text }) {
  if (!text) return null;
  return <div className={`message ${type}`}>{text}</div>;
}
