// src/app/notifications/layout.tsx
export default function NotificationsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <div className="container mx-auto p-4">{children}</div>;
  }