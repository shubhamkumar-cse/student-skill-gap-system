// components/PriorityBadge.jsx
export default function PriorityBadge({ priority }) {
  return <span className={`badge ${String(priority).toLowerCase()}`}>{priority}</span>;
}
