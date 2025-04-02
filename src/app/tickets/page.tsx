"use client";

import { useEffect, useState } from "react";
import { Container, Card, ListGroup, Spinner, Alert, Button } from "react-bootstrap";

const TicketsPage = () => {
	const [registrations, setRegistrations] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchRegistrations();
	}, []);

	const fetchRegistrations = async () => {
		const userId = localStorage.getItem("userId");

		if (!userId) {
			setError("User not logged in");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(`/api/register?userId=${userId}`);
			const data = await response.json();

			if (response.ok) {
				setRegistrations(data.registrations);
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError("Failed to fetch registrations.");
		} finally {
			setLoading(false);
		}
	};

	// ✅ Cancel Registration
	const handleCancel = async (registrationId: string) => {
		if (!window.confirm("Are you sure you want to cancel this registration?")) return;

		try {
			const response = await fetch(`/api/register?registrationId=${registrationId}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setRegistrations((prev) =>
					prev.filter((registration) => registration._id !== registrationId)
				);
			} else {
				const data = await response.json();
				setError(data.message || "Failed to cancel registration.");
			}
		} catch (err) {
			setError("Failed to cancel registration.");
		}
	};

	// ✅ Edit Ticket Count
	const handleEdit = async (registrationId: string, currentTickets: number) => {
		const newTickets = prompt("Enter new number of tickets:", currentTickets.toString());

		if (!newTickets) return;
		const ticketCount = parseInt(newTickets, 10);

		if (isNaN(ticketCount) || ticketCount <= 0) {
			alert("Please enter a valid number of tickets.");
			return;
		}

		try {
			const response = await fetch(`/api/register`, {
				method: "PATCH", // ✅ Changed to PATCH
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ registrationId, tickets: ticketCount }), // ✅ Send data in body
			});

			const data = await response.json();
			if (response.ok) {
				// ✅ Update the ticket count in state
				setRegistrations((prev) =>
					prev.map((registration) =>
						registration._id === registrationId
							? { ...registration, tickets: ticketCount }
							: registration
					)
				);
			} else {
				setError(data.message || "Failed to update tickets.");
			}
		} catch (err) {
			setError("Failed to update tickets.");
		}
	};

	return (
		// Set the outermost container to fill the viewport
		<div
			style={{
				minHeight: "100vh", // Ensure it fills the entire viewport height
				background: "linear-gradient(to right, #667eea, #764ba2)", // Gradient background
				padding: "20px", // Add padding around the entire page
			}}
		>
			<Container className="mt-4">
				<h2 className="mb-4 text-white">My Registered Events</h2>

				{/* Loading state */}
				{loading && <Spinner animation="border" className="text-white" />}

				{/* Error handling */}
				{error && <Alert variant="danger">{error}</Alert>}

				{/* Display Registrations */}
				{registrations.length > 0 ? (
					<ListGroup>
						{registrations.map((registration) => {
							// Add a null check for registration.event before rendering
							const event = registration.event || {}; // Fallback to an empty object if event is null or undefined

							return (
								<Card key={registration._id} className="mb-3 shadow-md border-t-4 border-blue-500">
									<Card.Body>
										<Card.Title className="text-xl text-indigo-600">
											{event.name || "Event Name Unavailable"}
										</Card.Title>
										<Card.Text className="text-gray-700">
											{event.description || "Description not available."}
										</Card.Text>
										<ListGroup variant="flush">
											<ListGroup.Item className="text-gray-500">
												Date: {new Date(event.date).toLocaleDateString() || "N/A"}
											</ListGroup.Item>
											<ListGroup.Item className="text-gray-500">
												Tickets: {registration.tickets}
											</ListGroup.Item>
											<ListGroup.Item className="text-gray-500">
												Ticket Type: {event.ticketType || "N/A"}
											</ListGroup.Item>
										</ListGroup>

										{/* Edit Tickets Button */}
										<Button
											variant="warning"
											className="mt-3 me-2 bg-orange-500 hover:bg-orange-600 text-white"
											onClick={() =>
												handleEdit(registration._id, registration.tickets)
											}
										>
											Edit Tickets
										</Button>

										{/* Cancel Registration Button */}
										<Button
											variant="danger"
											className="mt-3 bg-red-500 hover:bg-red-600 text-white"
											onClick={() => handleCancel(registration._id)}
										>
											Cancel Registration
										</Button>
									</Card.Body>
								</Card>
							);
						})}
					</ListGroup>
				) : (
					// Show message if no registrations exist
					!loading && <Alert variant="info" className="bg-gray-100 text-gray-800">No registrations found.</Alert>
				)}
			</Container>
		</div>
	);
};

export default TicketsPage;