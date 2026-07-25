import { NavLink, useNavigate } from "react-router-dom";
import { theme } from "../theme";

function Sidebar() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: "block",
    padding: "12px 18px",
    borderRadius: 8,
    marginBottom: 6,
    textDecoration: "none",
    color: isActive ? "#fff" : theme.colors.text,
    background: isActive ? theme.colors.primary : "transparent",
    fontWeight: 500,
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
      <h2 style={{ fontSize: 20, marginBottom: 30 }}>🚀 LeadDesk</h2>

      <NavLink to="/dashboard" style={linkStyle}>📊 Dashboard</NavLink>
      <NavLink to="/leads" style={linkStyle}>📋 Leads</NavLink>

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