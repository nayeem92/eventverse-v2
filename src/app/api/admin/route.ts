import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User"; // Ensure correct import

// 🔹 GET: Fetch all users
export async function GET() {
	try {
		await connectToDatabase();
		const users = await User.find({}, "-password"); // Exclude password field
		return NextResponse.json({ success: true, users }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Error fetching users" },
			{ status: 500 }
		);
	}
}

// 🔹 PUT: Update user name & email
export async function PUT(req: Request) {
	try {
		const { userId, name, email } = await req.json();
		if (!userId || !name || !email) {
			return NextResponse.json(
				{ success: false, message: "Missing required fields" },
				{ status: 400 }
			);
		}

		await connectToDatabase();
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ name, email },
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: "User updated", user: updatedUser },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Error updating user" },
			{ status: 500 }
		);
	}
}

// 🔹 DELETE: Remove a user
export async function DELETE(req: Request) {
	try {
		const { userId } = await req.json();
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "User ID is required" },
				{ status: 400 }
			);
		}

		await connectToDatabase();
		const deletedUser = await User.findByIdAndDelete(userId);
		if (!deletedUser) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: "User deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Error deleting user" },
			{ status: 500 }
		);
	}
}
