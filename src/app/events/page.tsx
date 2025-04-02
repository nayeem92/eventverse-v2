"use client";
import { FC, useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const EventPage: FC = () => {
	const [events, setEvents] = useState<any[]>([]);
	const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [date, setDate] = useState("");
	const router = useRouter();

	const fetchEvents = async () => {
		try {
			const res = await fetch("/api/events");
			const data = await res.json();
			setEvents(data);
			setFilteredEvents(data);
		} catch (error) {
			console.error("Error fetching events:", error);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const handleDelete = async (eventId: string) => {
		try {
			const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete event");
			setEvents(events.filter((event) => event._id !== eventId));
			setFilteredEvents(filteredEvents.filter((event) => event._id !== eventId));
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	};

	const handleEdit = (eventId: string) => {
		const eventToEdit = events.find((event) => event._id === eventId);
	};

	const handleRegister = (eventId: string) => {
		router.push(`/register/${eventId}`);
	};

	const handleFilterChange = () => {
		setFilteredEvents(
			events.filter((event) => {
				return (
					(category ? event.category === category : true) &&
					(location ? event.location === location : true) &&
					(date ? event.date === date : true)
				);
			})
		);
	};

	useEffect(() => {
		handleFilterChange();
	}, [category, location, date]);

	return (
		<Box sx={{ padding: 3 }}>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
				{filteredEvents.length > 0 ? (
					filteredEvents.map((event) => (
						<Box key={event._id} sx={{ width: "100%", maxWidth: 320 }}>
							<EventCard {...event} onEdit={handleEdit} onRegister={handleRegister} onDelete={handleDelete} />
						</Box>
					))
				) : (
					<Typography variant="h6" align="center">No events found</Typography>
				)}
			</Box>
		</Box>
	);
};

export default EventPage;
