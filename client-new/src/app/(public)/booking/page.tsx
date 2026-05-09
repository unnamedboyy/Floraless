import BookingForm from "@/components/form/BookingForm";

export default function BookingPage() {

  return (
    <section className="min-h-screen bg-[#f8f8f8] pt-36 pb-24">

      <div className="mx-auto max-w-7xl px-4">

        <div className="max-w-3xl">

          <p className="text-sm uppercase tracking-[0.3em] text-[#C9AE63]">
            Floraless Booking
          </p>

          <h1 className="mt-4 text-5xl font-bold leading-tight text-neutral-900">
            Wujudkan Acara
            <br />
            Impian Anda
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-neutral-600">
            Isi detail acara Anda dan tim Floraless akan segera
            menghubungi untuk proses konfirmasi dan penjadwalan.
          </p>

        </div>

        <div className="mt-16">
          <BookingForm />
        </div>

      </div>

    </section>
  );
}
