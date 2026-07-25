const colors: Record<string, { bg: string; text: string }> = {
  New: { bg: "#fef3c7", text: "#b45309" },
  Contacted: { bg: "#ede9fe", text: "#6d28d9" },
  Closed: { bg: "#dcfce7", text: "#15803d" },
};

function StatusBadge({ status }: { status: string }) {
  const c = colors[status] || colors.New;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "4px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;