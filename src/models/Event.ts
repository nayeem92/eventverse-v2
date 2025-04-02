import { Schema, model, models } from "mongoose";

const SponsorSchema = new Schema(
	{
		name: { type: String, required: true },
		website: { type: String, required: true },
	},
	{ timestamps: true } // Optional, to track when a sponsor is added or updated
);

const EventSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		image: { type: String },
		
		// Location field added
		location: { type: String, required: true },

		// Ticketing fields
		ticketType: { type: String, enum: ["free", "paid"], required: true },
		price: { type: Number, default: 0 }, // Price for paid events
		totalTickets: { type: Number, required: true }, // Total available tickets

		// Sponsors
		sponsors: [SponsorSchema], // An array of sponsors

		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

const Event = models.Event || model("Event", EventSchema);
export default Event;
