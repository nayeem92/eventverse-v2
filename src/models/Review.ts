import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
	user: mongoose.Schema.Types.ObjectId;
	event: mongoose.Schema.Types.ObjectId;
	rating: number;
	comment: string;
	createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

const Review =
	mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
