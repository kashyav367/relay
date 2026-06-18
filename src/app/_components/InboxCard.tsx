"use client";

import { useEffect, useState } from "react";

export default function InboxCard() {
  const [emails, setEmails] = useState<any[]>([]);

 useEffect(() => {
  fetch("/api/inbox")
    .then((r) => r.json())
    .then((data) => {
      console.log("Inbox API:", data);

      if (Array.isArray(data)) {
        setEmails(data);
      } else if (Array.isArray(data?.emails)) {
        setEmails(data.emails);
      } else {
        setEmails([]);
      }
    })
    .catch(console.error);
}, []);

  return (
    <div className="rounded-xl border p-4">
      <h2 className="font-bold text-lg mb-4">
        Inbox
      </h2>

      <div className="space-y-3">
        {Array.isArray(emails) &&emails.map((email) => (
          <div
            key={email.id}
            className="border-b pb-2"
          >
            <p className="font-medium text-sm">
              {email.subject}
            </p>

            <p className="text-xs text-gray-500">
              {email.from}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}