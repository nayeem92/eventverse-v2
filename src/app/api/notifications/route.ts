import connect from '../../../lib/db';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the Notification schema
const NotificationSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timestamp: String,
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export async function GET() {
  try {
    await connect(); // Connect to MongoDB

    const notifications = await Notification.find({ userId: 'user_1' }); // Adjust based on your needs
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: 'Error fetching notifications', error: (error as Error).message }, { status: 500 });
  }
}
