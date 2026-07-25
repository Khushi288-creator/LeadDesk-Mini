import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import { useToast } from "../components/Toast";
import { theme } from "../theme";

function Login() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginAdmin(email, password);
      localStorage.setItem("token", res.token);
      showToast("Login Successful 🚀");
      navigate("/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Login Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: theme.colors.bg }}>
      <form
        onSubmit={handleLogin}
        style={{ width: 380, padding: 30, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}
      >
        <h1>LeadDesk Mini</h1>
        <p style={{ color: theme.colors.muted, marginBottom: 20 }}>Admin Login</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 12, marginTop: 15, border: `1px solid ${theme.colors.border}`, borderRadius: 8, boxSizing: "border-box" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, marginTop: 15, border: `1px solid ${theme.colors.border}`, borderRadius: 8, boxSizing: "border-box" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 20,
            cursor: "pointer",
            background: theme.colors.primary,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {loading ? "Logging..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;