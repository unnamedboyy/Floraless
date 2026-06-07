import Image from "next/image";

const imgs = [
  { src: "/gal-1.jpg"},
  { src: "/gal-2.jpg"},
  { src: "/gal-3.jpg"},
  { src: "/gal-4.jpg"},
];

function Item({ img }: any) {
  return (
    <div className="group relative h-[260px] overflow-hidden rounded-2xl md:h-[320px]">
      {/* Image */}
      <Image
        src={img.src}
        alt=""
        fill
        className="object-cover transition duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* Text */}
      <div className="pointer-events-none absolute bottom-6 left-6 translate-y-4 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-lg font-semibold tracking-wide">
          {img.title}
        </p>
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section id="schedule" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-4xl font-semibold text-black md:text-5xl">
          Galeri Kami
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8">
            <Item img={imgs[0]} />
          </div>

          <div className="md:col-span-4">
            <Item img={imgs[1]} />
          </div>

          <div className="md:col-span-4">
            <Item img={imgs[2]} />
          </div>

          <div className="md:col-span-8">
            <Item img={imgs[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}