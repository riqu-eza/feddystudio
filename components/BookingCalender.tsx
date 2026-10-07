"use client";
import { useEffect, useMemo, useState } from "react";

function key(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function BookingCalendar({
  onSelect,
}: {
  onSelect?: (date: string) => void;
}) {
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [calendarDate, setCalendarDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState<string>("");

  // Phase 2 will fetch from /api/availability — for now, empty array
  useEffect(() => {
    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : { booked: [] }))
      .then((d) => setBookedDates(d.booked || []))
      .catch(() => setBookedDates([]));
  }, []);

  const y = calendarDate.getFullYear();
  const m = calendarDate.getMonth();

  const days = useMemo(() => {
    const first = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const now = new Date();
    const today = key(now.getFullYear(), now.getMonth(), now.getDate());
    const cells: (null | { d: number; k: string; booked: boolean; today: boolean })[] =
      [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= total; d++) {
      const k = key(y, m, d);
      cells.push({
        d,
        k,
        booked: bookedDates.includes(k) || k < today,
        today: k === today,
      });
    }
    return cells;
  }, [y, m, bookedDates]);

  function selectDate(k: string) {
    setSelected(k);
    onSelect?.(k);
    const input = document.getElementById("date") as HTMLInputElement | null;
    if (input) input.value = k;
  }

  const monthTitle = calendarDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section id="calendar" className="py-[90px]">
      <div className="container-x">
        <div className="uppercase tracking-[3px] text-gold text-[0.78rem] font-bold">
          CHECK AVAILABILITY
        </div>
        <h2 className="text-[clamp(2rem,5vw,3.4rem)] mt-2 mb-[35px]">
          Booking Calendar
        </h2>
        <p className="text-muted max-w-[720px] mb-7">
          Check our studio availability before making your booking. Green dates
          are available and red dates are booked.
        </p>

        <div className="max-w-[760px] mx-auto bg-card border border-line rounded-[10px] p-6">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => {
                const d = new Date(calendarDate);
                d.setMonth(d.getMonth() - 1);
                setCalendarDate(d);
              }}
              className="w-[42px] h-[42px] border border-[#444] bg-[#111] text-white rounded text-2xl"
            >
              ‹
            </button>
            <h3 className="text-[1.35rem] font-semibold">{monthTitle}</h3>
            <button
              onClick={() => {
                const d = new Date(calendarDate);
                d.setMonth(d.getMonth() + 1);
                setCalendarDate(d);
              }}
              className="w-[42px] h-[42px] border border-[#444] bg-[#111] text-white rounded text-2xl"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-[7px] text-gold text-[0.75rem] text-center mb-[7px]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[7px]">
            {days.map((c, i) => {
              if (!c) return <div key={`e-${i}`} className="min-h-[54px]" />;
              const cls = c.booked
                ? "bg-[#321818] border-[#6b3030] text-[#aaa] cursor-not-allowed"
                : "bg-[#102318] border-[#285637] cursor-pointer";
              const isSelected = c.k === selected;
              return (
                <div
                  key={c.k}
                  onClick={() => !c.booked && selectDate(c.k)}
                  className={`min-h-[54px] border rounded p-[7px] text-[#ddd] ${cls} ${
                    c.today ? "shadow-[inset_0_0_0_2px_#d6ad5b]" : ""
                  } ${isSelected ? "!bg-gold !text-[#111] font-bold" : ""}`}
                >
                  {c.d}
                  <small className="block text-[0.65rem] mt-[3px]">
                    {c.booked ? "Not available" : "Available"}
                  </small>
                </div>
              );
            })}
          </div>

          <div className="flex gap-[22px] flex-wrap mt-5 text-muted text-[0.8rem]">
            <span>🟢 Available</span>
            <span>🔴 Booked</span>
            <span>🟡 Today</span>
          </div>

          <div className="mt-5 p-[13px] bg-[#101010] border border-line text-[#ccc] rounded">
            {selected
              ? `Selected date: ${new Date(
                  selected + "T12:00:00"
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`
              : "Select an available date to continue."}
          </div>

          <a
            href="#booking"
            className="inline-block mt-3 px-6 py-3 rounded bg-gold text-[#111] font-bold border border-gold"
          >
            Book Selected Date
          </a>
        </div>
      </div>
    </section>
  );
}