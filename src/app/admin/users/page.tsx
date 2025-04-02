"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
	CircularProgress,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";

interface User {
	_id: string;
	name: string;
	email: string;
	role: string;
}

const roles = ["Event Manager", "Event Handler", "Volunteer", "Member"];

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch users
	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setFetching(true);
		setError(null);

		try {
			const res = await fetch("/api/admin", { method: "GET" });
			const data = await res.json();
			if (data.success) {
				setUsers(data.users);
			} else {
				setError("Failed to fetch users.");
			}
		} catch (error) {
			setError("Error fetching users. Please try again.");
			console.error("Error fetching users:", error);
		} finally {
			setFetching(false);
		}
	};

	// Update user
	const updateUser = async () => {
		if (!editingUser) return;

		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/admin", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: editingUser._id,
					name: editingUser.name,
					email: editingUser.email,
					role: editingUser.role,
				}),
			});

			const data = await res.json();
			if (data.success) {
				setUsers((prevUsers) =>
					prevUsers.map((u) =>
						u._id === editingUser._id ? { ...u, role: editingUser.role } : u
					)
				);
				setEditingUser(null); // Close editing
			} else {
				setError("Failed to update user.");
			}
		} catch (error) {
			setError("Error updating user. Please try again.");
			console.error("Error updating user:", error);
		} finally {
			setLoading(false);
		}
	};

	// Delete user
	const deleteUser = async (userId: string) => {
		if (!confirm("Are you sure you want to delete this user?")) return;

		setError(null);

		try {
			const res = await fetch("/api/admin", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			});

			const data = await res.json();
			if (data.success) {
				fetchUsers(); // Refresh list
			} else {
				setError("Failed to delete user.");
			}
		} catch (error) {
			setError("Error deleting user. Please try again.");
			console.error("Error deleting user:", error);
		}
	};

	return (
		<Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
			<Typography variant="h4" textAlign="center" mb={3}>
				Admin - Manage Users
			</Typography>

			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

			{fetching ? (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				users.map((user) => (
					<Card key={user._id} sx={{ mb: 2 }}>
						<CardContent>
							{editingUser && editingUser._id === user._id ? (
								<>
									<TextField
										label="Name"
										fullWidth
										value={editingUser.name}
										onChange={(e) =>
											setEditingUser((prev) => prev ? { ...prev, name: e.target.value } : null)
										}
										sx={{ mb: 2 }}
									/>
									<TextField
										label="Email"
										fullWidth
										value={editingUser.email}
										onChange={(e) =>
											setEditingUser((prev) => prev ? { ...prev, email: e.target.value } : null)
										}
										sx={{ mb: 2 }}
									/>
									<Select
										fullWidth
										value={editingUser?.role || "Member"} // Default to "Member"
										onChange={(e) =>
											setEditingUser((prev) => prev ? { ...prev, role: e.target.value } : null)
										}
										sx={{ mb: 2 }}
									>
										{roles.map((role) => (
											<MenuItem key={role} value={role}>
												{role}
											</MenuItem>
										))}
									</Select>

									<Button
										variant="contained"
										color="success"
										onClick={updateUser}
										disabled={loading}
									>
										{loading ? "Updating..." : "Save"}
									</Button>
									<Button
										variant="outlined"
										sx={{ ml: 2 }}
										onClick={() => setEditingUser(null)}
									>
										Cancel
									</Button>
								</>
							) : (
								<>
									<Typography variant="h6">{user.name}</Typography>
									<Typography color="text.secondary">{user.email}</Typography>
									<Typography color="text.primary" sx={{ mt: 1 }}>
										<strong>Role:</strong> {user.role}
									</Typography>
									<Button
										sx={{ mt: 1 }}
										variant="contained"
										onClick={() => setEditingUser(user)}
									>
										Edit
									</Button>
									<Button
										sx={{ mt: 1, ml: 2 }}
										variant="contained"
										color="error"
										onClick={() => deleteUser(user._id)}
									>
										Delete
									</Button>
								</>
							)}
						</CardContent>
					</Card>
				))
			)}
		</Box>
	);
}
