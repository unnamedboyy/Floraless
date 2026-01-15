import Image from "next/image";

const imgs = ["/gal-1.jpg", "/gal-2.jpg", "/gal-3.jpg", "/gal-4.jpg"];

export default function Gallery() {
  return (
    <section id="schedule" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-semibold">Galeri Kami</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[320px]">
              <Image src={imgs[0]} alt="Gallery 1" fill className="object-cover" />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[320px]">
              <Image src={imgs[1]} alt="Gallery 2" fill className="object-cover" />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[320px]">
              <Image src={imgs[2]} alt="Gallery 3" fill className="object-cover" />
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[320px]">
              <Image src={imgs[3]} alt="Gallery 4" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
