import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
connect();

export async function POST(request: NextRequest) {
	try {
		const requestBody = await request.json();
		const { token } = requestBody;
		console.log(token);
		const user = await User.findOne({
			verifyToken: token,
			verifyTokenExpiry: { $gt: Date.now() },
		});
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 400 },
			);
		}
		console.log(user);
		user.isVerfied = true;
		user.verifyToken = undefined;
		user.verifyTokenExpiry = undefined;
		await user.save();
		return NextResponse.json({ message: "Email verified", success: true });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.message },
			{
				status: 400,
			},
		);
	}
}
