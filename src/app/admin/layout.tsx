// src/app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container-fluid p-4">{children}</div>;
}
