import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";
import mongoose from "mongoose"; // Import mongoose

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	await connectToDatabase();

	// Validate ID format
	if (!mongoose.Types.ObjectId.isValid(params.id)) {
		return NextResponse.json({ message: "Invalid Event ID" }, { status: 400 });
	}

	try {
		const event = await Event.findById(params.id);
		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		return NextResponse.json(event, { status: 200 });
	} catch (error) {
		console.error("Error fetching event:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
