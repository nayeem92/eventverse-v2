// app/api/events/[id]/sponsors/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";

// Get all sponsors for a specific event
export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params; // Await the params before accessing its properties
		await connectToDatabase();

		const event = await Event.findById(id);
		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		return NextResponse.json({ sponsors: event.sponsors }, { status: 200 });
	} catch (error) {
		console.error("Error fetching sponsors:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Add a sponsor to the event
export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params; // Await the params before accessing its properties
		const { name, website } = await req.json(); // Get the sponsor data from the request body

		await connectToDatabase();

		const event = await Event.findById(id);
		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		// Add the new sponsor to the event
		event.sponsors.push({ name, website });

		await event.save(); // Save the updated event

		return NextResponse.json(
			{ message: "Sponsor added successfully", event },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding sponsor:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Update a sponsor's information for a specific event
export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params; // Await the params before accessing its properties
		const { sponsorId, name, website } = await req.json(); // Get the sponsor data to update

		await connectToDatabase();

		const event = await Event.findById(id);
		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		// Find the sponsor and update their details
		const sponsor = event.sponsors.id(sponsorId);
		if (!sponsor) {
			return NextResponse.json(
				{ message: "Sponsor not found" },
				{ status: 404 }
			);
		}

		sponsor.name = name;
		sponsor.website = website;

		await event.save(); // Save the updated event with the modified sponsor

		return NextResponse.json(
			{ message: "Sponsor updated successfully", event },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating sponsor:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Remove a sponsor from the event
export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params; // Await the params before accessing its properties
		const { sponsorId } = await req.json(); // Get sponsorId from request body

		await connectToDatabase();

		// Find the event by ID
		const event = await Event.findById(id);

		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		// Find the sponsor within the event and remove it
		const sponsorIndex = event.sponsors.findIndex(
			(sponsor) => sponsor._id.toString() === sponsorId
		);

		if (sponsorIndex === -1) {
			return NextResponse.json(
				{ message: "Sponsor not found" },
				{ status: 404 }
			);
		}

		// Remove the sponsor from the sponsors array
		event.sponsors.splice(sponsorIndex, 1);
		await event.save();

		return NextResponse.json(
			{ message: "Sponsor removed successfully", event: event },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting sponsor:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
