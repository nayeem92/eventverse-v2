import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
	user: mongoose.Types.ObjectId;
	event: mongoose.Types.ObjectId;
	tickets: number;
	paymentStatus: "pending" | "completed"; // Useful for paid events
	createdAt: Date;
}

const RegistrationSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		tickets: { type: Number, required: true, min: 1 }, // At least 1 ticket
		paymentStatus: {
			type: String,
			enum: ["pending", "completed"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Registration ||
	mongoose.model<IRegistration>("Registration", RegistrationSchema);
