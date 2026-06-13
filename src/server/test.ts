// import "dotenv/config";
// import { corsair } from "./corsair";

// async function main() {
//   const calendar = corsair.withTenant("dev").googlecalendar.api;

//   const event = await calendar.events.get({
//     id: "rce1qas628borkonmnv470b1ts",
//     calendarId: "primary",
//   });

//   console.dir(event, { depth: null });
// }

// main().catch(console.error);
// import "dotenv/config";
// import { createCaller } from "./api/root";

// async function main() {
//   const caller = createCaller({} as any);

//   const event = await caller.calendar.getEvent({
//     id: "rce1qas628borkonmnv470b1ts",
//   });

//   console.log(event);
// }

// main().catch(console.error);


// import "dotenv/config";
// import { createCaller } from "./api/root";

// async function main() {
//   const caller = createCaller({} as any);

//   const event = await caller.calendar.createEvent({
//   summary: "Test Update",
//   description: "Testing",
//   start: "2026-06-14T18:00:00+05:30",
//   end: "2026-06-14T19:00:00+05:30",
// });

//   console.log(event);
// }

// main().catch(console.error);

import "dotenv/config";
import { createCaller } from "./api/root";

async function main() {
  const caller = createCaller({} as any);

  
const result = await caller.calendar.updateEvent({
  id: "s4co4q2pjg14mojb3ou65s3fok",
  summary: "Something exciting",
});


  console.log(result);
}

main().catch(console.error);






























