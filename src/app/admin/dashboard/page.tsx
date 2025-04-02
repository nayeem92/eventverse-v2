// src/app/admin/dashboard/page.tsx
'use client';
import Link from 'next/link';

const DashboardLanding = () => {
  return (
    <div className="p-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p>Select your dashboard view:</p>
      <ul>
        <li>
          <Link href="/admin/dashboard/super">
            Super Admin Dashboard
          </Link>
        </li>
        <li>
          <Link href="/admin/dashboard/event">
            Event Admin Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardLanding;
