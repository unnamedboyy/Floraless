export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ minHeight: "100vh" }}>
      {children}
    </main>
  );
}