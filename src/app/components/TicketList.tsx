// components/TicketList.tsx
import { FC } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface Ticket {
	title: string;
	type: string; // 'free' or 'paid'
	price?: number;
	quantity: number;
}

interface TicketListProps {
	tickets: Ticket[];
}

const TicketList: FC<TicketListProps> = ({ tickets }) => {
	return (
		<div>
			{tickets.map((ticket, index) => (
				<Card key={index} sx={{ marginBottom: 2 }}>
					<CardContent>
						<Typography variant="h6">{ticket.title}</Typography>
						<Typography variant="body2" color="text.secondary">
							Type: {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
						</Typography>
						{ticket.type === "paid" && (
							<Typography variant="body2" color="text.secondary">
								Price: ${ticket.price}
							</Typography>
						)}
						<Typography variant="body2" color="text.secondary">
							Quantity: {ticket.quantity}
						</Typography>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default TicketList;
