import { FC, useState, useEffect } from "react";
import { Button, TextField, Box } from "@mui/material";

interface UpdateEventFormProps {
	event: any;
	onClose: () => void;
	onUpdate: () => void;
}

const UpdateEventForm: FC<UpdateEventFormProps> = ({
	event,
	onClose,
	onUpdate,
}) => {
	// Convert event.date to YYYY-MM-DD format if needed
	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		return new Date(dateString).toISOString().split("T")[0]; // Extract YYYY-MM-DD
	};

	// State for event details
	const [title, setTitle] = useState(event.name);
	const [category, setCategory] = useState(event.category);
	const [location, setLocation] = useState(event.location);
	const [date, setDate] = useState(formatDate(event.date)); // Convert date format
	const [description, setDescription] = useState(event.description);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const updatedEvent = { name: title, category, location, date, description };

		try {
			const res = await fetch(`/api/events/${event._id}`, {
				method: "PUT",
				body: JSON.stringify(updatedEvent),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) throw new Error("Failed to update event");

			onUpdate(); // Refresh event list
			onClose(); // Close modal/form
		} catch (error) {
			console.error("Error updating event:", error);
		}
	};

	return (
		<Box sx={{ marginBottom: 3 }}>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Name"
					fullWidth
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					margin="normal"
				/>

				<TextField
					label="Date"
					type="date"
					fullWidth
					value={date} // Now correctly formatted
					onChange={(e) => setDate(e.target.value)}
					margin="normal"
					InputLabelProps={{
						shrink: true, // Ensure label doesn't overlap
					}}
				/>

				<TextField
					label="Description"
					fullWidth
					multiline
					rows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					margin="normal"
				/>

				<Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
					Update Event
				</Button>
			</form>
			<Button variant="outlined" onClick={onClose} sx={{ marginTop: 2 }}>
				Cancel
			</Button>
		</Box>
	);
};

export default UpdateEventForm;
