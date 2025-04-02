"use client";

import { useState, useEffect } from "react";
import { Container, TextField, Button, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, RadioGroup, Radio, Snackbar } from "@mui/material";
import { ToastContainer } from "react-toastify";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const EventCreation = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState("free");
  const [ticketPrice, setTicketPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [eventLocation, setEventLocation] = useState(""); // New state for location

  const [openSnackbar, setOpenSnackbar] = useState(false); // For Snackbar
  const [showConfetti, setShowConfetti] = useState(false); // For Confetti

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEventImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId) {
      alert("User not logged in. Please log in to create an event.");
      return;
    }

    if (ticketType === "paid" && !ticketPrice) {
      alert("Please enter a ticket price.");
      return;
    }
    if (!totalTickets) {
      alert("Please enter the total number of tickets.");
      return;
    }
    if (!eventLocation) {
      alert("Please select the event location.");
      return;
    }

    const eventData = {
      name: eventName,
      description: eventDescription,
      date: eventDate,
      location: eventLocation, // Include location in event data
      image: eventImage,
      ticketType,
      price: ticketType === "paid" ? parseFloat(ticketPrice) : 0,
      totalTickets: parseInt(totalTickets, 10),
      createdBy: userId,
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Snackbar Notification
        setOpenSnackbar(true);
        
        // Show Confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts 5 seconds

        // Reset form fields
        setEventName("");
        setEventDescription("");
        setEventDate("");
        setEventImage(null);
        setTicketType("free");
        setTicketPrice("");
        setTotalTickets("");
        setEventLocation(""); // Reset location
      } else {
        alert("Oops! Something went wrong. Please try again later.");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 5 }}>
      <Typography variant="h3" align="center" gutterBottom color="white">
        Create an Event
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                label="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                variant="outlined"
              />

              <TextField
                label="Event Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
                multiline
                rows={4}
                variant="outlined"
              />

              <TextField
                label="Event Date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />

              {/* Dropdown for Location */}
              <FormControl fullWidth required>
                <InputLabel>Event Location</InputLabel>
                <Select
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  label="Event Location"
                >
                  <MenuItem value="">Select a Location</MenuItem>
                  <MenuItem value="Toronto">Toronto</MenuItem>
                  <MenuItem value="Vancouver">Vancouver</MenuItem>
                  <MenuItem value="Montreal">Montreal</MenuItem>
                  <MenuItem value="Calgary">Calgary</MenuItem>
                  <MenuItem value="Ottawa">Ottawa</MenuItem>
                  <MenuItem value="Edmonton">Edmonton</MenuItem>
                </Select>
              </FormControl>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="eventImageUpload"
              />
              <label htmlFor="eventImageUpload">
                <Button variant="contained" component="span" fullWidth>
                  Upload Event Image
                </Button>
              </label>

              <FormControl component="fieldset" fullWidth>
                <Typography variant="subtitle1" color="textSecondary">
                  Ticket Type
                </Typography>
                <RadioGroup
                  row
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <FormControlLabel value="free" control={<Radio />} label="Free" />
                  <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                </RadioGroup>
              </FormControl>

              {ticketType === "paid" && (
                <TextField
                  label="Ticket Price ($)"
                  type="number"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  required
                  variant="outlined"
                  inputProps={{ min: 1 }}
                />
              )}

              <TextField
                label="Total Tickets"
                type="number"
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                required
                variant="outlined"
                inputProps={{ min: 1 }}
              />

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Snackbar Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={7000}
        onClose={() => setOpenSnackbar(false)}
        message={
          <>
            🎉 Congratulations! Your event "{eventName}" has been successfully created! 🎉
            <br />
            Your event is now live and will be visible soon. Thank you for hosting with us!
            <br />
            💬 Feel free to share this with your friends and invite them to join.
          </>
        }
      />

      {/* Confetti Animation */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </Container>
  );
};

export default EventCreation;
