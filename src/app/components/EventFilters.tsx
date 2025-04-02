// components/EventFilters.tsx
"use client";
import { FC } from "react";
import {
	Box,
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
} from "@mui/material";

interface EventFiltersProps {
	categories: string[];
	locations: string[];
	onCategoryChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	onDateChange: (value: string) => void;
}

const EventFilters: FC<EventFiltersProps> = ({
	categories,
	locations,
	onCategoryChange,
	onLocationChange,
	onDateChange,
}) => {
	return (
		<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, padding: 3 }}>
			<FormControl fullWidth>
				<InputLabel>Category</InputLabel>
				<Select
					onChange={(e) => onCategoryChange(e.target.value)}
					label="Category"
				>
					{categories.map((category) => (
						<MenuItem key={category} value={category}>
							{category}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth>
				<InputLabel>Location</InputLabel>
				<Select
					onChange={(e) => onLocationChange(e.target.value)}
					label="Location"
				>
					{locations.map((location) => (
						<MenuItem key={location} value={location}>
							{location}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<TextField
				label="Date"
				type="date"
				onChange={(e) => onDateChange(e.target.value)}
				InputLabelProps={{
					shrink: true,
				}}
				fullWidth
			/>
		</Box>
	);
};

export default EventFilters;
