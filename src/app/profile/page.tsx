"use client";

import { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";

export default function ProfilePage() {
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		if (storedUserId) setUserId(storedUserId);
	}, []);

	return (
		<div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
			<div className="container bg-white p-5 rounded shadow">
				<h1 className="text-center mb-4">Welcome to Your Profile</h1>
				{userId ? (
					<ProfileForm userId={userId} />
				) : (
					<p className="text-center">Loading...</p>
				)}
			</div>
		</div>
	);
}
