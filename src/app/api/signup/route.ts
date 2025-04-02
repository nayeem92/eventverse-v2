import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json();

		// Validate inputs
		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		await connectToDatabase();

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();

		return NextResponse.json(
			{ message: "User created successfully", user: newUser },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Signup Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
