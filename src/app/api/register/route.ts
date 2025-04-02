import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import mongoose from "mongoose";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { connectToDatabase } from "@/lib/mongodb";

// 📌 Handle POST request - Register User for an Event
export async function POST(req: NextRequest) {
	await connectToDatabase();

	try {
		const { userId, eventId, tickets } = await req.json();

		// Check if the event exists
		const event = await Event.findById(eventId);
		if (!event) {
			return NextResponse.json({ message: "Event not found" }, { status: 404 });
		}

		// Check if enough tickets are available
		if (event.totalTickets < tickets) {
			return NextResponse.json(
				{ message: "Not enough tickets available" },
				{ status: 400 }
			);
		}

		// Create registration
		const registration = new Registration({
			user: new mongoose.Types.ObjectId(userId),
			event: new mongoose.Types.ObjectId(eventId),
			tickets,
			paymentStatus: event.ticketType === "paid" ? "pending" : "completed",
		});

		await registration.save();

		// Deduct tickets from event
		event.totalTickets -= tickets;
		await event.save();

		return NextResponse.json(
			{ message: "Registration successful", registration },
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}
// 📌 Handle PUT request - Update Number of Tickets
export async function PATCH(req: NextRequest) {
	await connectToDatabase();

	try {
		const { registrationId, tickets } = await req.json();

		// Find existing registration
		const registration = await Registration.findById(registrationId).populate(
			"event"
		);
		if (!registration) {
			return NextResponse.json(
				{ message: "Registration not found" },
				{ status: 404 }
			);
		}

		// Check if the event has enough tickets
		const event = registration.event;
		const ticketDifference = tickets - registration.tickets;

		if (ticketDifference > event.totalTickets) {
			return NextResponse.json(
				{ message: "Not enough tickets available" },
				{ status: 400 }
			);
		}

		// Update tickets and event availability
		event.totalTickets -= ticketDifference;
		await event.save();

		registration.tickets = tickets;
		await registration.save();

		return NextResponse.json(
			{ message: "Tickets updated successfully", registration },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}

// 📌 Handle DELETE request - Cancel Registration
export async function DELETE(req: NextRequest) {
	await connectToDatabase();

	try {
		const { searchParams } = new URL(req.url);
		const registrationId = searchParams.get("registrationId");

		if (!registrationId) {
			return NextResponse.json(
				{ message: "Missing registrationId" },
				{ status: 400 }
			);
		}

		// Find and delete registration
		const registration = await Registration.findById(registrationId).populate(
			"event"
		);
		if (!registration) {
			return NextResponse.json(
				{ message: "Registration not found" },
				{ status: 404 }
			);
		}

		// Restore event ticket count
		const event = registration.event;
		event.totalTickets += registration.tickets;
		await event.save();

		await Registration.findByIdAndDelete(registrationId);

		return NextResponse.json(
			{ message: "Registration deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}

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

		const registrations = await Registration.find({ user: userId })
			.populate("event")
			.select("event tickets");

		return NextResponse.json(
			{ message: "Registrations fetched successfully", registrations },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Server Error", error },
			{ status: 500 }
		);
	}
}
