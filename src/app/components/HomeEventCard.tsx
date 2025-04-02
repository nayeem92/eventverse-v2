"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	CardMedia,
	Box,
	Chip,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";


interface EventCardProps {
	_id: string;
	name: string;
	location: string;
	date: string;
	category: string;
	description: string;
	ticketType: string;
	price?: number;
	image?: string;
	createdBy: string;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onRegister: (id: string) => void;
}

const EventCard: FC<EventCardProps> = ({
	_id,
	name,
	location,
	date,
	category,
	description,
	ticketType,
	price,
	image,
	createdBy,
	onEdit,
	onDelete,
	onRegister,
}) => {
	const router = useRouter();
	const [userId, setUserId] = useState<string | null>(null);

	// Retrieve the logged-in user ID from localStorage
	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		setUserId(storedUserId);
	}, []);

	const handleEventClick = () => {
		router.push(`/eventdetail?eventId=${_id}`);
	};

	return (
		<Card
			sx={{
				maxWidth: 380,
				borderRadius: 4,
				boxShadow: 8,
				overflow: "hidden",
				position: "relative",
				transition: "transform 0.3s ease, box-shadow 0.3s ease",
				"&:hover": {
					transform: "scale(1.05)",
					boxShadow: 12,
				},
				background: "rgba(225, 245, 252, 0.93)",
				backdropFilter: "blur(10px)",
				border: "5px solid rgba(255, 255, 255, 0.14)",
			}}
		>
			{image && (
				<CardMedia
					component="img"
					height="200"
					image={image}
					alt={name}
					sx={{
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
						objectFit: "cover",
					}}
				/>
			)}

			<CardContent>
				<Typography
					variant="h5"
					fontWeight="bold"
					color="primary"
					sx={{
						cursor: "pointer",
						"&:hover": { textDecoration: "underline" },
					}}
					onClick={handleEventClick}
				>
					{name}
				</Typography>

				{/* Category & Location */}
				<Box display="flex" justifyContent="space-between" mt={1}>
					<Chip
						icon={<LocationOnIcon />}
						label={location}
						color="info"
						variant="outlined"
					/>
				</Box>

				{/* Date */}
				<Typography
					variant="body2"
					color="text.secondary"
					fontWeight="bold"
					mt={2}
					display="flex"
					alignItems="center"
					gap={1}
				>
					<CalendarTodayIcon fontSize="small" />
					{new Date(date).toLocaleDateString()}
				</Typography>

				{/* Ticket Type & Price */}
				<Typography
					variant="body1"
					fontWeight="bold"
					mt={1}
					color={ticketType === "free" ? "green" : "error"}
					display="flex"
					alignItems="center"
					gap={1}
				>
					{ticketType === "free" ? (
						<>
							🎟 Free Event
						</>
					) : (
						<>
							<AttachMoneyIcon fontSize="small" />
							{price ? `$${price}` : "N/A"}
						</>
					)}
				</Typography>

				{/* Description */}
				<Typography
					variant="body2"
					color="text.secondary"
					mt={2}
					sx={{
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: 3,
						overflow: "hidden",
					}}
				>
					{description}
				</Typography>
			</CardContent>

			<CardActions
				sx={{
					display: "flex",
					justifyContent: "space-between",
					px: 2,
					pb: 2,
					backgroundColor: "rgba(0,0,0,0.05)",
					borderTop: "1px solid rgba(255,255,255,0.2)",
				}}
			>
				<Button
						variant="contained"
						color="success"
						onClick={() => onRegister(_id)}
						sx={{ fontWeight: "bold" }}
					>
						Register
					</Button>

				<Button
					variant="contained"
					color="secondary"
					startIcon={<StarBorderPurple500Icon />}
					onClick={() => router.push(`/review?eventId=${_id}`)}
					sx={{ fontWeight: "bold" }}
				>
					Add Review
				</Button>
			</CardActions>
		</Card>
	);
};

export default EventCard;
