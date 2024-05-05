import { writeFileSync } from "node:fs";

writeFileSync(
  "google-application-credentials.json",
  Buffer.from(process.argv[2] ?? "", "base64"),
);
