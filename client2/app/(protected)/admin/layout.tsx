import AdminSidebar from "@/components/AdminSidebar";
// import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-neutral-100 min-h-screen pl-20">

      <AdminSidebar />

      <main className="flex-1 p-0">

        {/* <AdminNavbar /> */}

        {children}

      </main>

    </div>
  );
}