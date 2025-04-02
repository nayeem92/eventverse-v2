import React from 'react';
import DiscussionBoard from "../../components/DiscussionBoard";
import EventCheckIn from "../../components/EventCheckIn";

export default function EventPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>
      <DiscussionBoard />
      <EventCheckIn />
    </div>
  );
}

