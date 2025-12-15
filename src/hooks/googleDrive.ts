import { google } from "googleapis";

export function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error("Missing Google service account credentials");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n").trim(), // ensure no extra spaces
    scopes: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
}


export async function getDrive() {
  console.log("Key loaded? ", !!process.env.GOOGLE_PRIVATE_KEY);
  console.log("Key length: ", process.env.GOOGLE_PRIVATE_KEY?.length);

  const auth = getAuth();
  await auth.authorize(); // ensures the token is ready
  return google.drive({ version: "v3", auth });
}
