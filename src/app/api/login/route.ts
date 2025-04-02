import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User"; // Import the User model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret"; // Keep secret in .env

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		await connectToDatabase();

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Validate password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ message: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Generate JWT token
		const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
			expiresIn: "1h",
		});

		return NextResponse.json(
			{ message: "Login successful", token, userId: user._id },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Login Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
