import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const fallback = [
  { title: "PORTRAITS", ratio: "aspect-[4/5]" },
  { title: "GRADUATION", ratio: "aspect-square" },
  { title: "WEDDINGS", ratio: "aspect-[4/5]" },
  { title: "MATERNITY", ratio: "aspect-square" },
  { title: "EVENTS", ratio: "aspect-[4/5]" },
  { title: "BRAND CONTENT", ratio: "aspect-square" },
];

export default async function Portfolio() {
  const items = await prisma.portfolioItem.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const hasItems = items.length > 0;

  return (
    <section id="portfolio" className="py-[90px]">
      <div className="container-x">
        <div className="uppercase tracking-[3px] text-gold text-[0.78rem] font-bold">
          Selected work
        </div>
        <h2 className="text-[clamp(2rem,5vw,3.4rem)] mt-2 mb-[35px]">
          Our Portfolio
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          {hasItems
            ? items.map((it, i) => (
                <div
                  key={it.id}
                  className={`${
                    i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                  } bg-photo-grad flex items-end p-[18px] overflow-hidden rounded relative group`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="relative z-10">
                    <span className="font-bold drop-shadow">
                      {it.title.toUpperCase()}
                    </span>
                    {it.caption && (
                      <p className="text-xs text-[#ddd] mt-1">{it.caption}</p>
                    )}
                  </div>
                </div>
              ))
            : fallback.map((p, i) => (
                <div
                  key={i}
                  className={`${p.ratio} bg-photo-grad flex items-end p-[18px] overflow-hidden`}
                >
                  <span className="font-bold drop-shadow-[0_2px_8px_#000]">
                    {p.title}
                  </span>
                </div>
              ))}
        </div>

        {!hasItems && (
          <p className="text-[#777] mt-4">
            Replace these portfolio placeholders with your best studio images.
          </p>
        )}
      </div>
    </section>
  );
}