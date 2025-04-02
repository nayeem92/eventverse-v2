import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import mongoose from "mongoose";

// 📌 Handle POST request - Add Review
export async function POST(req: NextRequest) {
	await connectToDatabase();

	try {
		const { userId, eventId, rating, comment } = await req.json();

		if (!userId || !eventId || !rating || !comment) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		const review = new Review({
			user: new mongoose.Types.ObjectId(userId),
			event: new mongoose.Types.ObjectId(eventId),
			rating,
			comment,
		});

		await review.save();

		return NextResponse.json(
			{ message: "Review added successfully", review },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding review:", error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}

// 📌 Handle GET request - Fetch Reviews for an Event
// 📌 Handle GET request - Fetch Reviews for a User
export async function GET(req: NextRequest) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");
		const eventId = searchParams.get("eventId");

		if (!userId && !eventId) {
			return NextResponse.json(
				{ message: "User ID or Event ID is required" },
				{ status: 400 }
			);
		}

		let filter = {};
		if (userId) {
			filter = { user: new mongoose.Types.ObjectId(userId) };
		}
		if (eventId) {
			filter = { event: new mongoose.Types.ObjectId(eventId) };
		}

		const reviews = await Review.find(filter)
			.populate("event", "name") // Populate event name
			.select("rating comment createdAt");

		return NextResponse.json(
			{ message: "Reviews fetched successfully", reviews },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return NextResponse.json(
			//{ message: "Server Error", error: error.message },
			{ status: 500 }
		);
	}
}

// 📌 Handle PATCH request - Update a Review
export async function PATCH(req: NextRequest) {
	await connectToDatabase();

	try {
		const { reviewId, rating, comment } = await req.json();

		if (!reviewId || (!rating && !comment)) {
			return NextResponse.json(
				{ message: "Review ID and at least one field to update are required" },
				{ status: 400 }
			);
		}

		const review = await Review.findByIdAndUpdate(
			reviewId,
			{ rating, comment },
			{ new: true }
		);

		if (!review) {
			return NextResponse.json(
				{ message: "Review not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Review updated successfully", review },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating review:", error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}

// 📌 Handle DELETE request - Remove Review
export async function DELETE(req: NextRequest) {
	await connectToDatabase();

	try {
		const { searchParams } = new URL(req.url);
		const reviewId = searchParams.get("reviewId");

		if (!reviewId) {
			return NextResponse.json(
				{ message: "Review ID is required" },
				{ status: 400 }
			);
		}

		const review = await Review.findByIdAndDelete(reviewId);

		if (!review) {
			return NextResponse.json(
				{ message: "Review not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Review deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting review:", error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}
