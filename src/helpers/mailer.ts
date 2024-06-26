// domain.com/verifyToken/asdwadfg
// domain.com/verifyToken?token=awdawfawdawd
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { getMaxListeners } from "events";

export const sendEmail = async ({ email, emailType, userId }: any) => {
	try {
		const hashedToken = await bcryptjs.hash(userId.toString(), 10);
		if (emailType === "VERIFY") {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000,
			});
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			});
		}
		const transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "d5c96b969b0514",
				pass: process.env.NODEMAILER_PASSWORD,
			},
		});
		const mailOption = {
			from: "shreyas15oct@gmail.com",
			to: email,
			subject: 
				emailType === "VERIFY" ? "Verify Email" : "Reset Your Password",
			html: `<p>Click <a href="${process.env.DOMAIN}/${
				emailType === "VERIFY" ? "verifyemail" : "resetpassword"
			}?token=${hashedToken}">here</a> to ${
				emailType === "VERIFY" ? "verify" : "reset your password"
			}</p>`,
		};
		const mailResponse = await transporter.sendMail(mailOption);
		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
