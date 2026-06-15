"use client";

import { useEffect, useState } from "react";

export default function CalendarCard() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.items ?? []);
      });
  }, []);

  return (
    <div className="rounded-xl border p-4">
      <h2 className="font-bold text-lg mb-4">
        Calendar
      </h2>

      <div className="space-y-3">
        {events.slice(0, 5).map((event) => (
          <div
            key={event.id}
            className="border-b pb-2"
          >
            <p className="font-medium text-sm">
              {event.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}