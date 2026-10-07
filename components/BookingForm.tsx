"use client";
import { useState } from "react";
import { Input, Select, Textarea } from "./ui/Input";
import Button from "./ui/Button";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      // WhatsApp fallback (Phase 1). Phase 2 will offer M-Pesa instead.
      const wa = `https://wa.me/254742246706?text=${encodeURIComponent(
        `Hello FEDDY STUDIO, I would like to book.\nName: ${payload.name}\nPhone: ${payload.phone}\nService: ${payload.service}\nDate: ${payload.date}\nDetails: ${payload.message}\nHow they heard about us: ${payload.referral}`
      )}`;
      window.open(wa, "_blank");

      (e.target as HTMLFormElement).reset();
      alert("Booking request sent!");
    } catch {
      alert("Could not send booking. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="booking" className="py-[90px]">
      <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-[30px]">
        <div>
          <div className="uppercase tracking-[3px] text-gold text-[0.78rem] font-bold">
            Reserve your date
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.4rem)] mt-2 mb-[35px]">
            Book a Session
          </h2>
          <p className="text-muted">
            Tell us what you need and we will get back to you with availability
            and a package recommendation.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-3 bg-card-grad p-8 border border-[#3a3020] rounded-lg"
        >
          <Input id="name" name="name" placeholder="Your name" required />
          <Input
            id="phone"
            name="phone"
            placeholder="Phone / WhatsApp"
            required
          />
          <Select id="service" name="service" required defaultValue="">
            <option value="">Select service</option>
            <option>Portrait Photography</option>
            <option>Graduation</option>
            <option>Wedding</option>
            <option>Baby Bump</option>
            <option>Event Photography</option>
            <option>Videography</option>
            <option>Commercial Content</option>
          </Select>
          <Input id="date" name="date" type="date" required />
          <Select id="referral" name="referral" defaultValue="">
            <option value="">How did you hear about us?</option>
            <option>Friend / Client Referral</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>TikTok</option>
            <option>Google Search</option>
            <option>WhatsApp</option>
            <option>Poster / Flyer</option>
            <option>Other</option>
          </Select>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us about your shoot"
          />
          <div>
            <Button type="submit" variant="primary">
              {loading ? "Sending…" : "Send Booking Request"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}