import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	phone?: string;
	address?: string;
	country?: string;
}

const UserSchema: Schema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	phone: { type: String },
	address: { type: String },
	country: { type: String },
});

export default mongoose.models.User ||
	mongoose.model<IUser>("User", UserSchema);
