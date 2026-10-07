import Card from "./ui/Card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Services() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section id="services" className="py-[90px]">
      <div className="container-x">
        <div className="uppercase tracking-[3px] text-gold text-[0.78rem] font-bold">
          What we do
        </div>
        <h2 className="text-[clamp(2rem,5vw,3.4rem)] mt-2 mb-[35px]">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {services.map((s) => (
            <Card key={s.id}>
              <div className="text-[2rem]">{s.icon}</div>
              <h3 className="mt-2.5 mb-2.5 text-white text-xl font-semibold">
                {s.title}
              </h3>
              <p className="text-muted">{s.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}