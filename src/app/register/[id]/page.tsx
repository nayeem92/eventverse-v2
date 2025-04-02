"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	Box,
	Typography,
	Button,
	TextField,
	Card,
	CardContent,
	Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Confetti from "react-confetti";

const RegisterPage = () => {
	const { id } = useParams();
	const router = useRouter();
	const [event, setEvent] = useState<any | null>(null);
	const [tickets, setTickets] = useState(1);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState<string | null>(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);

	// Fetch logged-in userId from localStorage
	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		setUserId(storedUserId);
	}, []);

	// Fetch event details
	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const res = await fetch(`/api/registrations/${id}`);
				if (!res.ok) throw new Error("Failed to fetch event");
				const data = await res.json();
				setEvent(data);
			} catch (error) {
				console.error("Error fetching event:", error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchEvent();
	}, [id]);

	// Handle registration
	const handleRegister = async () => {
		if (!userId) {
			alert("User not logged in");
			return;
		}

		try {
			const res = await fetch(`/api/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, eventId: id, tickets }),
			});

			if (!res.ok) throw new Error("Registration failed");

			setOpenSnackbar(true); // Show success message
			setShowConfetti(true); // Show confetti
			setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 sec
			setTimeout(() => router.push("/events"), 3000); // Redirect after 3 sec
		} catch (error) {
			console.error("Error registering:", error);
			alert("Registration failed");
		}
	};

	if (loading) return <Typography>Loading...</Typography>;
	if (!event) return <Typography>Event not found</Typography>;

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "80vh",
			}}
		>
			{showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

			<Card sx={{ padding: 3, maxWidth: 400 }}>
				<CardContent>
					<Typography variant="h5" fontWeight="bold" gutterBottom>
						Register for {event.name}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						📍 {event.location} | 📅 {new Date(event.date).toLocaleDateString()}
					</Typography>
					<Typography variant="body1" fontWeight="bold" mt={2}>
						{event.ticketType === "free" ? "🎟 Free Event" : `💰 Price: $${event.price}`}
					</Typography>
					<TextField
						type="number"
						label="Number of Tickets"
						variant="outlined"
						fullWidth
						value={tickets}
						onChange={(e) => setTickets(Number(e.target.value))}
						inputProps={{ min: 1 }}
						sx={{ mt: 2 }}
					/>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						sx={{ mt: 3 }}
						onClick={handleRegister}
					>
						Confirm Registration
					</Button>
				</CardContent>
			</Card>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={5000}
				onClose={() => setOpenSnackbar(false)}
			>
				<MuiAlert severity="success" onClose={() => setOpenSnackbar(false)}>
					🎉 Successfully registered for {event.name}!
				</MuiAlert>
			</Snackbar>
		</Box>
	);
};

export default RegisterPage;
