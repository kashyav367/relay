import "dotenv/config";
import { corsair } from "./corsair";

const main = async () => {
  try {
    const res = await corsair
      .withTenant("dev")
      .googlecalendar.api.events.create({
        calendarId: "primary",
        event: {
          summary: "Test Event",
          description: "Created from Corsair",
          start: {
            dateTime: "2026-06-15T10:00:00+05:30",
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: "2026-06-15T11:00:00+05:30",
            timeZone: "Asia/Kolkata",
          },
        },
      });

    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
};

main().catch(console.error);