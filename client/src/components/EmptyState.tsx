function EmptyState({ message = "No data found" }: { message?: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        color: "#6b7280",
      }}
    >
      <div style={{ fontSize: 40 }}>📭</div>
      <p style={{ marginTop: 10 }}>{message}</p>
    </div>
  );
}

export default EmptyState;