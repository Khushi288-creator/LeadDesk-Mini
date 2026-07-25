import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { getStats } from "../services/leadService";

function Sidebar() {
  const navigate = useNavigate();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getStats();
        const stats = (res.data as any).stats || (res.data as any);
        setNewCount(stats?.newLeads || 0);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000); // har 10 sec check
    return () => clearInterval(interval);
  }, []);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    borderRadius: 8,
    marginBottom: 6,
    textDecoration: "none",
    color: isActive ? "#fff" : theme.colors.text,
    background: isActive ? theme.colors.primary : "transparent",
    fontWeight: 500,
    transition: "background 0.15s ease",
  });

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#fff",
        borderRight: `1px solid ${theme.colors.border}`,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 30, display: "flex", alignItems: "center", gap: 8 }}>
        🚀 LeadDesk
      </h2>

      <NavLink to="/dashboard" style={linkStyle}>📊 Dashboard</NavLink>

      <NavLink to="/leads" style={linkStyle}>
        <span>📋 Leads</span>
        {newCount > 0 && (
          <span
            style={{
              background: theme.colors.danger,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 10,
              padding: "2px 8px",
              minWidth: 18,
              textAlign: "center",
            }}
          >
            {newCount}
          </span>
        )}
      </NavLink>

      <button
        onClick={logout}
        style={{
          marginTop: 40,
          width: "100%",
          padding: 12,
          border: "none",
          borderRadius: 8,
          background: theme.colors.danger,
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;