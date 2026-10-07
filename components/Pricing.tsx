import Card from "./ui/Card";
import Button from "./ui/Button";
import { waLink } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Pricing() {
  const rows = await prisma.rate.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  const rates = rows.map((r) => ({
    ...r,
    items: r.items as string[],
  }));

  return (
    <section id="pricing" className="py-[90px]">
      <div className="container-x">
        <div className="uppercase tracking-[3px] text-gold text-[0.78rem] font-bold">
          FEDDY STUDIO RATE CARD
        </div>
        <h2 className="text-[clamp(2rem,5vw,3.4rem)] mt-2 mb-[35px]">
          Photography Rates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {rates.map((r) => (
            <Card key={r.id}>
              <div className="text-[2rem]">{r.icon}</div>
              <h3 className="mt-2.5 mb-2.5 text-white text-xl font-semibold">
                {r.title}
              </h3>
              <div className="text-[2rem] text-gold my-3 font-semibold">
                {r.price}
              </div>
              <ul className="text-[#bbb]">
                {r.items.map((it) => (
                  <li
                    key={it}
                    className="py-[7px] border-b border-line-soft last:border-b-0"
                  >
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button
                  href={waLink(r.ctaMessage)}
                  target="_blank"
                  variant="primary"
                >
                  {r.ctaLabel}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-[#777] mt-5 text-center">
          Custom packages are available. Contact FEDDY STUDIO for bookings and
          package details.
        </p>
      </div>
    </section>
  );
}