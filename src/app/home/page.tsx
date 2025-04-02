"use client";

import { FC, useState, useEffect } from "react";
import EventCard from "../components/HomeEventCard";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Container,
} from "@mui/material";
import { useRouter } from "next/navigation";

const EventPage: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((event) => event._id !== eventId));
      setFilteredEvents(filteredEvents.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleRegister = (eventId: string) => {
    router.push(`/register/${eventId}`);
  };

  const categories = ["Music", "Tech", "Art"];
  const locations = ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"];

  const handleFilterChange = () => {
    setFilteredEvents(
      events.filter((event) => {
        return (
          (category ? event.category === category : true) &&
          (location ? event.location === location : true) &&
          (search ? event.title.toLowerCase().includes(search.toLowerCase()) : true)
        );
      })
    );
  };

  useEffect(() => {
    handleFilterChange();
  }, [category, location, search]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Explore Events
        </Typography>

        {/* Filters */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", mb: 3 }}>
          <TextField
            label="Search Events"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FormControl>
            <InputLabel>Location</InputLabel>
            <Select value={location} onChange={(e) => setLocation(e.target.value)} sx={{ minWidth: 120 }}>
              <MenuItem value="">All</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Events List */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Box key={event._id} sx={{ width: "100%", maxWidth: 320 }}>
                <EventCard {...event} onRegister={handleRegister} onDelete={handleDelete} />
              </Box>
            ))
          ) : (
            <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
              No events found
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default EventPage;
