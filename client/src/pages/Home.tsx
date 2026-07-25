import { useState } from "react";
import { createLead } from "../services/leadService";
import { theme } from "../theme";

const budgetOptions = [
  { label: "Under ₹10,000", value: 5000 },
  { label: "₹10,000 - ₹50,000", value: 30000 },
  { label: "₹50,000 - ₹1,00,000", value: 75000 },
  { label: "Above ₹1,00,000", value: 150000 },
];

function Home() {
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.budget) errs.budget = "Select a budget range";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await createLead({
        name: form.name,
        email: form.email,
        budget: Number(form.budget),
        message: form.message,
      });
      setSuccess(true);
      setForm({ name: "", email: "", budget: "", message: "" });
    } catch (err: any) {
      setErrors({ submit: err.response?.data?.message || "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 8,
    boxSizing: "border-box" as const,
    fontSize: 14,
  };

  const errorStyle = { color: theme.colors.danger, fontSize: 12, marginTop: 4 };

  return (
    <div style={{ minHeight: "100vh", background: theme.colors.bg }}>
      <div style={{ textAlign: "center", padding: "60px 20px 30px" }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>🚀 LeadDesk</h1>
        <p style={{ color: theme.colors.muted, fontSize: 18, marginTop: 10 }}>
          Tell us about your project. We'll get back to you within 24 hours.
        </p>
      </div>

      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          background: theme.colors.card,
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.06)",
        }}
      >
        {success ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <h3 style={{ marginTop: 10 }}>Thank you!</h3>
            <p style={{ color: theme.colors.muted }}>We've received your details and will reach out soon.</p>
            <button
              onClick={() => setSuccess(false)}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                background: theme.colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />
            {errors.name && <div style={errorStyle}>{errors.name}</div>}

            <label style={{ display: "block", marginTop: 16 }}>Email</label>
            <input name="email" value={form.email} onChange={handleChange} style={inputStyle} />
            {errors.email && <div style={errorStyle}>{errors.email}</div>}

            <label style={{ display: "block", marginTop: 16 }}>Budget Range</label>
            <select name="budget" value={form.budget} onChange={handleChange} style={inputStyle}>
              <option value="">Select a range</option>
              {budgetOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {errors.budget && <div style={errorStyle}>{errors.budget}</div>}

            <label style={{ display: "block", marginTop: 16 }}>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} style={{ ...inputStyle, minHeight: 90 }} />
            {errors.message && <div style={errorStyle}>{errors.message}</div>}

            {errors.submit && <div style={errorStyle}>{errors.submit}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                marginTop: 20,
                background: theme.colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>

      <p style={{ textAlign: "center", marginTop: 30 }}>
        <a href="/login" style={{ color: theme.colors.muted, fontSize: 13 }}>Admin Login →</a>
      </p>
    </div>
  );
}

export default Home;