"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Data for different event metrics
const attendeeData = [
  { name: "Jan", attendees: 120 },
  { name: "Feb", attendees: 200 },
  { name: "Mar", attendees: 250 },
  { name: "Apr", attendees: 310 },
  { name: "May", attendees: 400 },
];

const revenueData = [
  { name: "Jan", revenue: 5000 },
  { name: "Feb", revenue: 7000 },
  { name: "Mar", revenue: 3000 },
  { name: "Apr", revenue: 12000 },
  { name: "May", revenue: 10000 },
];

const eventCategoryData = [
  { name: "Tech", value: 40, fill: "#ff6363" },
  { name: "Business", value: 30, fill: "#f39c12" },
  { name: "Health", value: 20, fill: "#8e44ad" },
  { name: "Education", value: 10, fill: "#2ecc71" },
];

const eventFeedbackData = [
  { name: "Excellent", value: 40, fill: "#34d399" },
  { name: "Good", value: 35, fill: "#f59e0b" },
  { name: "Average", value: 15, fill: "#ef4444" },
  { name: "Poor", value: 10, fill: "#8b5cf6" },
];

const topEventsData = [
  { name: "Tech Conference 2025", revenue: 10000, attendees: 300 },
  { name: "Health Expo 2025", revenue: 8000, attendees: 220 },
  { name: "Business Summit 2025", revenue: 12000, attendees: 400 },
];

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-purple-800 p-4 rounded-2xl shadow-md">
    <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
    <div>{children}</div>
  </div>
);

const EventAdminPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<{ name: string } | null>(null);

  const handleCategoryChange = (category: { name: string }) => {
    setSelectedCategory(category);
  };

  // Calculating stats based on the selected category
  const selectedCategoryData = topEventsData.filter(event =>
    event.name.toLowerCase().includes(selectedCategory?.name?.toLowerCase() || "")
  );

  const totalRevenue = selectedCategoryData.reduce((sum, event) => sum + event.revenue, 0);
  const totalAttendees = selectedCategoryData.reduce((sum, event) => sum + event.attendees, 0);
  const averageAttendees = selectedCategoryData.length > 0 ? totalAttendees / selectedCategoryData.length : 0;

  return (
    <div className="min-h-screen bg-purple-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Event Admin Dashboard</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => handleCategoryChange({ name: "Tech" })}
          className="bg-purple-700 px-4 py-2 rounded-lg text-black"
        >
          Tech
        </button>
        <button
          onClick={() => handleCategoryChange({ name: "Business" })}
          className="bg-purple-700 px-4 py-2 rounded-lg text-black"
        >
          Business
        </button>
        <button
          onClick={() => handleCategoryChange({ name: "Health" })}
          className="bg-purple-700 px-4 py-2 rounded-lg text-black"
        >
          Health
        </button>
        <button
          onClick={() => handleCategoryChange({ name: "Education" })}
          className="bg-purple-700 px-4 py-2 rounded-lg text-black"
        >
          Education
        </button>
      </div>

      {selectedCategory && (
        <div className="mb-6 text-center text-white">
          <h3 className="text-2xl font-semibold">Category: {selectedCategory.name}</h3>
          <p>Total Revenue: ${totalRevenue}</p>
          <p>Total Attendees: {totalAttendees}</p>
          <p>Average Attendees: {averageAttendees}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendee Growth Chart */}
        <Card title="Attendee Growth">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendeeData}>
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip wrapperClassName="text-black" />
              <Legend wrapperStyle={{ color: "white" }} />
              <Bar
                dataKey="attendees"
                fill="url(#barGradient)"
                barSize={40}
                radius={[10, 10, 0, 0]}
                isAnimationActive={true}
                label={{ position: 'top', fill: 'white', fontSize: '14px' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Trends Chart */}
        <Card title="Revenue Trends">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip wrapperClassName="text-black" />
              <Legend wrapperStyle={{ color: "white" }} />
              <Line type="monotone" dataKey="revenue" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Event Categories Distribution Chart */}
        <Card title="Event Categories">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart width={400} height={400}>
              <Pie
                data={eventCategoryData}
                dataKey="value"
                nameKey="name"
                label={({ name, value, percent }) => (
                  <text
                    x={percent > 0.1 ? 20 : -20}
                    y={-10}
                    fill="#fff"
                    textAnchor="middle"
                    fontSize={14}
                  >
                    {name}: {value} ({(percent * 100).toFixed(0)}%)
                  </text>
                )}
                outerRadius={120}
                innerRadius={80}
                paddingAngle={5}
                animationBegin={0}
                animationDuration={3500}
                animationEasing="ease-in-out"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#333',
                  borderRadius: '5px',
                  borderColor: '#444',
                  color: '#fff',
                }}
                labelStyle={{
                  fontWeight: 'bold',
                }}
              />
              <Legend
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  backgroundColor: '#1f2937',
                  padding: '10px',
                  borderRadius: '8px',
                }}
                formatter={(value) => (
                  <span style={{ color: '#fff' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Event Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Event Feedback">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart width={400} height={400}>
              <Pie
                data={eventFeedbackData}
                dataKey="value"
                nameKey="name"
                label={({ name, value, percent }) => (
                  <text
                    x={percent > 0.1 ? 20 : -20}
                    y={-10}
                    fill="#fff"
                    textAnchor="middle"
                    fontSize={14}
                  >
                    {name}: {value} ({(percent * 100).toFixed(0)}%)
                  </text>
                )}
                outerRadius={120}
                innerRadius={80}
                fill="fill"
                paddingAngle={5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#333',
                  borderRadius: '5px',
                  borderColor: '#444',
                  color: '#fff',
                }}
                labelStyle={{
                  fontWeight: 'bold',
                }}
              />
              <Legend
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  backgroundColor: '#1f2937',
                  padding: '10px',
                  borderRadius: '8px',
                }}
                formatter={(value) => (
                  <span style={{ color: '#fff' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Top Events">
          <div className="text-white">
            {topEventsData.map((event, index) => (
              <div key={index} className="bg-purple-700 p-4 mb-4 rounded-lg">
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p>Revenue: ${event.revenue}</p>
                <p>Attendees: {event.attendees}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EventAdminPage;
