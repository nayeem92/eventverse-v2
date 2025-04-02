'use client';
import { useState } from 'react'; // Add useState for state management
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import StatsCard from '@/app/components/admin/StatsCard';
import ApprovalList from '@/app/components/admin/ApprovalList';
import demoData from '@/app/data/demoData.json';
import { FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa'; // Icons for stats cards

ChartJS.register(...registerables);

const SuperAdminDashboard = () => {
  const { salesData } = demoData.superAdmin;

  // State for pending approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, name: 'Summer Music Festival', submittedBy: 'user123' },
    { id: 2, name: 'Tech Conference 2023', submittedBy: 'user456' },
  ]);

  // State for total events
  const [totalEvents, setTotalEvents] = useState(demoData.superAdmin.totalEvents);

  // Handle approve action
  const handleApprove = (id: number) => {
    setPendingApprovals((prev) => prev.filter((approval) => approval.id !== id));
    setTotalEvents((prev) => prev + 1); // Increment total events
    console.log(`Approved item with id: ${id}`);
  };

  // Handle reject action
  const handleReject = (id: number) => {
    setPendingApprovals((prev) => prev.filter((approval) => approval.id !== id));
    console.log(`Rejected item with id: ${id}`);
  };

  // Gradient for the chart
  const gradient = document.createElement('canvas').getContext('2d');
  const chartGradient = gradient?.createLinearGradient(0, 0, 0, 200);
  chartGradient?.addColorStop(0, 'rgba(99, 102, 241, 0.6)'); // Indigo
  chartGradient?.addColorStop(1, 'rgba(99, 102, 241, 0)'); // Transparent

  const chartData = {
    ...salesData,
    datasets: salesData.datasets.map((dataset) => ({
      ...dataset,
      borderColor: '#6366f1', // Line color
      backgroundColor: chartGradient, // Gradient fill
      fill: true,
      tension: 0.4, // Smooth line
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#e0e0e0',
        },
        ticks: {
          font: {
            size: 12,
          },
          stepSize: 100,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Super Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Events"
          value={totalEvents}
          variant="primary"
          subtitle="+12% from last month"
          icon={<FaCalendarAlt className="text-2xl" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingApprovals.length}
          variant="danger"
          subtitle="High priority"
          icon={<FaExclamationCircle className="text-2xl" />}
        />
      </div>

      {/* Approval List */}
      <ApprovalList
        approvals={pendingApprovals}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Sales Analytics Chart */}
      <div className="card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-8">
        <div className="card-body p-6">
          <h5 className="card-title text-xl font-semibold mb-4 text-gray-800">Sales Analytics</h5>
          <div style={{ height: '250px' }}>
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;