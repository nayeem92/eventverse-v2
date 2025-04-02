"use client";

import { useEffect, useState } from "react";

interface ProfileData {
	phone: string;
	address: string;
	country: string;
}

export default function ProfileForm({ userId }: { userId: string }) {
	const [profile, setProfile] = useState<ProfileData>({
		phone: "",
		address: "",
		country: "",
	});
	const [loading, setLoading] = useState(false);

	// Fetch user profile data
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(`/api/profile?userId=${userId}`);
				if (!response.ok) throw new Error("Failed to fetch profile");

				const data = await response.json();
				if (!data.user) throw new Error("User profile not found");

				setProfile({
					phone: data.user.phone || "",
					address: data.user.address || "",
					country: data.user.country || "",
				});
			} catch (error) {
				console.error(error);
			}
		};

		fetchProfile();
	}, [userId]);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch(`/api/profile`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, ...profile }),
			});

			if (!response.ok) throw new Error("Failed to update profile");
			alert("Profile updated successfully!");
		} catch (error) {
			console.error(error);
			alert("Error updating profile.");
		} finally {
			setLoading(false);
		}
	};

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	// Handle profile deletion
	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete your profile?")) return;

		try {
			const response = await fetch(`/api/profile?userId=${userId}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Failed to delete profile");
			alert("Profile deleted successfully!");
			localStorage.removeItem("userId");
			setProfile({ phone: "", address: "", country: "" });
			window.location.href = "/signup";
		} catch (error) {
			console.error(error);
			alert("Error deleting profile.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="container bg-white p-4 rounded shadow-sm"
		>
			<div className="mb-3">
				<label className="form-label">Phone</label>
				<input
					type="text"
					name="phone"
					value={profile.phone}
					onChange={handleChange}
					className="form-control"
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Address</label>
				<input
					type="text"
					name="address"
					value={profile.address}
					onChange={handleChange}
					className="form-control"
				/>
			</div>

			<div className="mb-3">
				<label className="form-label">Country</label>
				<input
					type="text"
					name="country"
					value={profile.country}
					onChange={handleChange}
					className="form-control"
				/>
			</div>

			<div className="d-flex justify-content-between">
				<button
					type="submit"
					disabled={loading}
					className="btn btn-primary w-48"
				>
					{loading ? "Updating..." : "Update Profile"}
				</button>

				<button
					type="button"
					onClick={handleDelete}
					className="btn btn-danger w-48"
				>
					Delete Profile
				</button>
			</div>
		</form>
	);
}
