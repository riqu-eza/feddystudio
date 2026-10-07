import Button from "./ui/Button";
import { waLink } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen grid place-items-center text-center px-5 pt-[120px] pb-[70px] bg-hero-radial"
    >
      <div>
        <div className="uppercase tracking-[3px] text-gold text-[0.78rem] font-bold">
          Photography • Videography • Creative
        </div>
        <h1 className="text-[clamp(3rem,9vw,7rem)] tracking-[7px] leading-none mt-2">
          FEDDY <span className="text-gold">STUDIO</span>
        </h1>
        <p className="max-w-[680px] mx-auto mt-6 text-[#ccc] text-[1.1rem]">
          We turn real moments into timeless photographs and cinematic stories.
          Professional studio and outdoor photography for individuals, families,
          brands and events.
        </p>
        <div className="flex justify-center gap-3 flex-wrap mt-6">
          <Button href="#booking" variant="primary">
            Book a Shoot
          </Button>
          <Button
            href={waLink(
              "Hello FEDDY STUDIO, I'd like to make a booking."
            )}
            target="_blank"
          >
            WhatsApp Us
          </Button>
        </div>
      </div>
    </section>
  );
}