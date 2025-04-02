// components/TicketForm.tsx
import { FC, useState } from "react";
import {
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
} from "@mui/material";

interface TicketFormProps {
	onCreateTicket: (ticket: Ticket) => void;
}

interface Ticket {
	title: string;
	type: string; // 'free' or 'paid'
	price?: number;
	quantity: number;
}

const TicketForm: FC<TicketFormProps> = ({ onCreateTicket }) => {
	const [title, setTitle] = useState("");
	const [ticketType, setTicketType] = useState("free");
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(0);

	const handleSubmit = () => {
		const newTicket: Ticket = {
			title,
			type: ticketType,
			price: ticketType === "paid" ? price : undefined,
			quantity,
		};
		onCreateTicket(newTicket);
		setTitle("");
		setTicketType("free");
		setPrice(0);
		setQuantity(0);
	};

	return (
		<div>
			<TextField
				label="Ticket Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
				required
				margin="normal"
			/>
			<FormControl fullWidth margin="normal">
				<InputLabel>Ticket Type</InputLabel>
				<Select
					value={ticketType}
					onChange={(e) => setTicketType(e.target.value)}
					label="Ticket Type"
				>
					<MenuItem value="free">Free</MenuItem>
					<MenuItem value="paid">Paid</MenuItem>
				</Select>
			</FormControl>

			{ticketType === "paid" && (
				<TextField
					label="Price"
					type="number"
					value={price}
					onChange={(e) => setPrice(Number(e.target.value))}
					fullWidth
					required
					margin="normal"
				/>
			)}

			<TextField
				label="Quantity"
				type="number"
				value={quantity}
				onChange={(e) => setQuantity(Number(e.target.value))}
				fullWidth
				required
				margin="normal"
			/>

			<Button
				variant="contained"
				color="primary"
				onClick={handleSubmit}
				fullWidth
				sx={{ marginTop: 2 }}
			>
				Create Ticket
			</Button>
		</div>
	);
};

export default TicketForm;
