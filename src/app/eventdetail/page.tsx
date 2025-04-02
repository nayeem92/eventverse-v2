"use client";
import { FC, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	Typography,
	CardMedia,
	CircularProgress,
	Box,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";

interface EventData {
	_id: string;
	name: string;
	description: string;
	date: string;
	image: string | null;
	ticketType: string;
	price: number;
}

interface Sponsor {
	_id: string;
	name: string;
	website: string;
}

const EventDetailPage: FC = () => {
	const searchParams = useSearchParams();
	const eventId = searchParams.get("eventId");
	const router = useRouter();

	const [eventData, setEventData] = useState<EventData | null>(null);
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// States for adding a new sponsor
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [newSponsorName, setNewSponsorName] = useState<string>("");
	const [newSponsorWebsite, setNewSponsorWebsite] = useState<string>("");

	// Fetch event data and sponsors if eventId is available
	useEffect(() => {
		if (eventId) {
			const fetchEventData = async () => {
				try {
					const res = await fetch(
						`http://localhost:3000/api/events/${eventId}`
					);
					if (!res.ok) {
						throw new Error("Failed to fetch event data");
					}
					const data = await res.json();
					setEventData(data);
				} catch (error) {
					setError("Failed to load event details");
					console.error(error);
				}
			};

			const fetchSponsors = async () => {
				try {
					const res = await fetch(
						`http://localhost:3000/api/events/${eventId}/sponsors/`
					);
					if (!res.ok) {
						throw new Error("Failed to fetch sponsors");
					}
					const data = await res.json();
					setSponsors(data.sponsors);
				} catch (error) {
					setError("Failed to load sponsors");
					console.error(error);
				}
			};

			fetchEventData();
			fetchSponsors();
			setLoading(false); // After both fetches, set loading to false
		} else {
			setError("No event ID found in the query");
			setLoading(false);
		}
	}, [eventId]);

	// Function to handle adding a new sponsor
	const addSponsor = async () => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/events/${eventId}/sponsors/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: newSponsorName,
						website: newSponsorWebsite,
					}),
				}
			);

			if (!res.ok) {
				throw new Error("Failed to add sponsor");
			}

			// After adding a sponsor, fetch the updated sponsors list
			// const newSponsor = await res.json();
			// setSponsors((prevSponsors) => [...prevSponsors, newSponsor]);
			// setOpenAddDialog(false); // Close the dialog after adding the sponsor
			// setNewSponsorName(""); // Reset the form
			// setNewSponsorWebsite(""); // Reset the form

			window.location.reload();
		} catch (error) {
			setError("Failed to add sponsor");
			console.error(error);
		}
	};

	// Function to delete sponsor
	const deleteSponsor = async (sponsorId: string) => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/events/${eventId}/sponsors/`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ sponsorId }),
				}
			);

			if (!res.ok) {
				throw new Error("Failed to delete sponsor");
			}

			// After successful deletion, filter out the sponsor from the list
			setSponsors((prevSponsors) =>
				prevSponsors.filter((sponsor) => sponsor._id !== sponsorId)
			);
		} catch (error) {
			setError("Failed to delete sponsor");
			console.error(error);
		}
	};

	// If loading, show a loading spinner
	if (loading) {
		return <CircularProgress />;
	}

	// If there's an error, display the error message
	if (error) {
		return (
			<Typography variant="h6" color="error">
				{error}
			</Typography>
		);
	}

	// If no event data is found, show a message
	if (!eventData) {
		return (
			<Typography variant="h6" color="error">
				Event not found
			</Typography>
		);
	}

	return (
		<Card sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
			{eventData.image && (
				<CardMedia
					component="img"
					height="180"
					image={eventData.image}
					alt={eventData.name}
				/>
			)}
			<CardContent>
				<Typography variant="h4" fontWeight="bold" color="primary">
					{eventData.name}
				</Typography>
				<Typography variant="body1" mt={2}>
					{eventData.description}
				</Typography>
				<Typography variant="body2" mt={1}>
					Date: {new Date(eventData.date).toLocaleDateString()}
				</Typography>
				<Typography variant="body2" mt={1}>
					Ticket Type: {eventData.ticketType}
				</Typography>
				<Typography variant="body2" mt={1}>
					Price: ${eventData.price}
				</Typography>
			</CardContent>

			{/* Add Sponsor Button */}
			<Box sx={{ padding: 2 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => setOpenAddDialog(true)}
				>
					Add Sponsor
				</Button>
			</Box>

			{/* Render Sponsors */}
			<Box sx={{ padding: 2 }}>
				<Typography variant="h6" fontWeight="bold" mt={3}>
					Sponsors
				</Typography>
				{!sponsors.length ? (
					<Typography>No sponsors available.</Typography>
				) : (
					sponsors.map((sponsor) => (
						<Box key={sponsor._id || sponsor.name} sx={{ mt: 2 }}>
							<Typography variant="body1" fontWeight="bold">
								{sponsor.name}
							</Typography>
							<Typography variant="body2">
								<a
									href={sponsor.website}
									target="_blank"
									rel="noopener noreferrer"
								>
									{sponsor.website}
								</a>
							</Typography>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => {
									setOpenAddDialog(true); // Open the add sponsor dialog
								}}
								sx={{ mt: 1 }}
							>
								Edit Sponsor
							</Button>
							<Button
								variant="outlined"
								color="error"
								onClick={() => deleteSponsor(sponsor._id)}
								sx={{ mt: 1 }}
							>
								Delete Sponsor
							</Button>
						</Box>
					))
				)}
			</Box>

			{/* Add Sponsor Dialog */}
			<Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
				<DialogTitle>Add Sponsor</DialogTitle>
				<DialogContent>
					<TextField
						label="Sponsor Name"
						fullWidth
						value={newSponsorName}
						onChange={(e) => setNewSponsorName(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Website"
						fullWidth
						value={newSponsorWebsite}
						onChange={(e) => setNewSponsorWebsite(e.target.value)}
						sx={{ mb: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenAddDialog(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={addSponsor} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default EventDetailPage;
