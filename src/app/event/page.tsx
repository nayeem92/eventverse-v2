"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventCreation from "../event/EventCreation";

const EventCreationPage = () => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			router.push("/login"); // Redirect if user is not logged in
		} else {
			setIsAuthenticated(true);
		}
	}, [router]);

	if (!isAuthenticated) {
		return <p>Redirecting to login...</p>;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<EventCreation />
		</div>
	);
};

export default EventCreationPage;
