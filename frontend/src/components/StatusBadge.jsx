// components/StatusBadge.jsx
const LABEL = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const CLASS = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${CLASS[status] || "not-started"}`}>{LABEL[status] || status}</span>;
}
