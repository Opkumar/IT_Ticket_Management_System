require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async (toEmail, subject, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: "gmail",
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: subject,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested a password reset. Click the button below to reset your password:</p>
                <a href="${resetUrl}" target="_blank" style="
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  background-color: #007BFF;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                ">
                  Reset Password
                </a>
                <p>This link will expire soon. If you didn't request this, please ignore this email.</p>
              </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Could not send reset password email");
  }
};
