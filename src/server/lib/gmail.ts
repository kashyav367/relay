export function buildRawEmailBase64({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].join("\r\n");

  return Buffer.from(email).toString("base64url");
}