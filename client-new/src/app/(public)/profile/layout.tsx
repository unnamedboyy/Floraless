import ProfileSidebar
from "@/components/layout/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <section className="
      min-h-screen
      bg-[#f8f8f8]
      pt-36
      pb-24
    ">

      

      <div className="
        mx-auto
        grid
        max-w-7xl
        gap-8
        px-4
        lg:grid-cols-[300px_1fr]
      ">

        {/* ===================================================
           SIDEBAR
        =================================================== */}

        <div className="
          h-fit
          lg:sticky
          lg:top-32
        ">

          <ProfileSidebar />

        </div>

        {/* ===================================================
           CONTENT
        =================================================== */}

        <div>
          {children}
        </div>

      </div>

    </section>
  );
}