"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	TextField,
	Button,
	Typography,
	Container,
	Rating,
} from "@mui/material";

const AddReviewPage = () => {
	const searchParams = useSearchParams();
	const eventId = searchParams.get("eventId");
	const router = useRouter();

	const [rating, setRating] = useState<number | null>(0);
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		const storedUserId = localStorage.getItem("userId");

		if (!storedUserId) {
			setError("User not authenticated. Please log in.");
			return;
		}

		if (!rating || !comment) {
			setError("Rating and comment are required.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/reviews", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: storedUserId, // Fetching user ID from localStorage
					eventId,
					rating,
					comment,
				}),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Something went wrong");

			alert("Review added successfully!");
			router.push(`/events`); // Redirect to event page
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 5 }}>
			<Typography variant="h4" fontWeight="bold" mb={2}>
				Add a Review
			</Typography>

			{error && <Typography color="error">{error}</Typography>}

			<Rating
				value={rating}
				onChange={(e, newValue) => setRating(newValue)}
				size="large"
			/>
			<TextField
				label="Your Review"
				variant="outlined"
				fullWidth
				multiline
				rows={4}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				sx={{ my: 2 }}
			/>

			<Button
				variant="contained"
				color="primary"
				onClick={handleSubmit}
				disabled={loading}
			>
				{loading ? "Submitting..." : "Submit Review"}
			</Button>
		</Container>
	);
};

export default AddReviewPage;
