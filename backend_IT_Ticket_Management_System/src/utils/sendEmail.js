require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
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
			from: process.env.EMAIL_USER,
			to: email,
			subject: subject,
			html: `
				<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
					<h2>Email Verification</h2>
					<p>Click the button below to verify your email:</p>
					<a href="${text}" 
					   style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
						Verify Email
					</a>
					<p>If you didn't request this, please ignore this email.</p>
				</div>
			`,
		};

		await transporter.sendMail(mailOptions);
		console.log("✅ Email sent successfully");
	} catch (error) {
		console.error("❌ Email not sent!", error);
		return error;
	}
};


