type DashboardCardProps = {
  title: string;
  value: number | string;
  color?: string;
};

function DashboardCard({
  title,
  value,
  color = "#2563eb",
}: DashboardCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <h3
        style={{
          color: "#666",
          fontSize: 16,
          marginBottom: 10,
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: 34,
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default DashboardCard;