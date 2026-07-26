import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendStatusUpdateEmail = async (
  toEmail: string,
  leadName: string,
  newStatus: string
) => {
  const statusMessages: Record<string, string> = {
    Contacted: "We've reviewed your inquiry and will be reaching out to you shortly.",
    Closed: "Thank you for your interest. This inquiry has been marked as closed.",
  };

  try {
    await transporter.sendMail({
      from: `"LeadDesk" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Update on your inquiry — Status: ${newStatus}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hi ${leadName},</h2>
          <p>${statusMessages[newStatus] || `Your inquiry status has been updated to: ${newStatus}`}</p>
          <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">— LeadDesk Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.log("Email send failed:", err);
  }
};