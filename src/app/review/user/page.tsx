"use client";

import { useEffect, useState } from "react";
import {
	Container,
	Card,
	ListGroup,
	Spinner,
	Alert,
	Button,
	Form,
} from "react-bootstrap";

const UserReviewsPage = () => {
	const [reviews, setReviews] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingReview, setEditingReview] = useState<string | null>(null);
	const [editedComment, setEditedComment] = useState("");
	const [editedRating, setEditedRating] = useState<number>(0);

	useEffect(() => {
		fetchReviews();
	}, []);

	const fetchReviews = async () => {
		const userId = localStorage.getItem("userId");

		if (!userId) {
			setError("User not logged in");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`/api/reviews?userId=${userId}`);
			const data = await response.json();

			if (response.ok) {
				setReviews(data.reviews);
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError("Failed to fetch reviews.");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (reviewId: string) => {
		if (!window.confirm("Are you sure you want to delete this review?")) return;

		try {
			const response = await fetch(`/api/reviews?reviewId=${reviewId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setReviews((prev) => prev.filter((review) => review._id !== reviewId));
			} else {
				const data = await response.json();
				setError(data.message || "Failed to delete review.");
			}
		} catch (err) {
			setError("Failed to delete review.");
		}
	};

	const handleEdit = async (reviewId: string) => {
		if (!editedComment || editedRating <= 0) {
			alert("Please enter valid comment and rating.");
			return;
		}

		try {
			const response = await fetch(`/api/reviews`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					reviewId,
					comment: editedComment,
					rating: editedRating,
				}),
			});

			const data = await response.json();
			if (response.ok) {
				setReviews((prev) =>
					prev.map((review) =>
						review._id === reviewId
							? { ...review, comment: editedComment, rating: editedRating }
							: review
					)
				);
				setEditingReview(null);
			} else {
				setError(data.message || "Failed to update review.");
			}
		} catch (err) {
			setError("Failed to update review.");
		}
	};

	return (
		<Container className="mt-4">
			<h2 className="mb-4">My Reviews</h2>

			{loading && <Spinner animation="border" />}
			{error && <Alert variant="danger">{error}</Alert>}

			{reviews.length > 0 ? (
				<ListGroup>
					{reviews.map((review) => {
						const event = review.event || {}; // Ensure review.event is not null

						return (
							<Card key={review._id} className="mb-3 shadow">
								<Card.Body>
									<Card.Title>
										Event: {event.name || "Event Name Unavailable"}
									</Card.Title>
									<Card.Text>Rating: {review.rating} / 5</Card.Text>
									{editingReview === review._id ? (
										<Form>
											<Form.Group>
												<Form.Label>New Rating</Form.Label>
												<Form.Control
													type="number"
													value={editedRating}
													onChange={(e) =>
														setEditedRating(Number(e.target.value))
													}
												/>
											</Form.Group>
											<Form.Group>
												<Form.Label>New Comment</Form.Label>
												<Form.Control
													as="textarea"
													value={editedComment}
													onChange={(e) => setEditedComment(e.target.value)}
												/>
											</Form.Group>
											<Button
												variant="success"
												className="mt-2"
												onClick={() => handleEdit(review._id)}
											>
												Save
											</Button>
										</Form>
									) : (
										<>
											<Card.Text>{review.comment}</Card.Text>
											<Button
												variant="warning"
												className="me-2"
												onClick={() => {
													setEditingReview(review._id);
													setEditedComment(review.comment);
													setEditedRating(review.rating);
												}}
											>
												Edit
											</Button>
											<Button
												variant="danger"
												onClick={() => handleDelete(review._id)}
											>
												Delete
											</Button>
										</>
									)}
								</Card.Body>
							</Card>
						);
					})}
				</ListGroup>
			) : (
				!loading && <Alert variant="info">No reviews found.</Alert>
			)}
		</Container>
	);
};

export default UserReviewsPage;
