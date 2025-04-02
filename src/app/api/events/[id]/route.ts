import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import Registration from "@/models/Registration";
import Event from "@/models/Event";

// Handle event update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Access params directly (no need to await)
    const { name, description, date } = await req.json(); // Get the updated data from the request body

    await connectToDatabase();

    // Find the event by ID and update
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { name, description, date }, // Updated values
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle event deletion
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Access params directly (no need to await)
    await connectToDatabase();

    // First, delete the corresponding reviews and registrations
    await Review.deleteMany({ event: id }); // Delete all reviews associated with the event
    await Registration.deleteMany({ event: id }); // Delete all registrations associated with the event

    // Now, delete the event
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event and related reviews/tickets deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle event retrieval
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Access params directly (no need to await)
    await connectToDatabase(); // Connect to the database

    // Fetch the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Return the event data
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
