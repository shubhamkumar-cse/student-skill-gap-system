// components/SkillBadge.jsx
const STATUS_LABEL = {
  AVAILABLE: "Available",
  PARTIALLY_KNOWN: "Partially Known",
  MISSING: "Missing",
};

const STATUS_CLASS = {
  AVAILABLE: "available",
  PARTIALLY_KNOWN: "partial",
  MISSING: "missing",
};

export default function SkillBadge({ status }) {
  return (
    <span className={`badge ${STATUS_CLASS[status] || "missing"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}
