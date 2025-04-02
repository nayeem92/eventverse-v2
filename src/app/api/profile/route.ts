import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

// 📌 GET - Fetch User Profile
export async function GET(req: NextRequest) {
	await connectToDatabase();

	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const user = await User.findById(userId).select("-password");
		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ user }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}

// 📌 PUT - Update User Profile
export async function PUT(req: NextRequest) {
	await connectToDatabase();

	try {
		const { userId, phone, address, country } = await req.json();

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ phone, address, country },
			{ new: true }
		).select("-password");

		if (!updatedUser) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Profile updated", user: updatedUser },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}

// 📌 DELETE - Remove User Profile Fields
export async function DELETE(req: NextRequest) {
	await connectToDatabase();

	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const deletedUser = await User.findByIdAndDelete(userId);
		if (!deletedUser) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ message: "Profile deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}
