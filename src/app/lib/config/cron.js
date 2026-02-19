import cron from "node-cron";
import fetch from "node-fetch";

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running invoice due email job...");
  try {
    const res = await fetch("http://localhost:3000/api/jobs");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error running cron job:", err);
  }
});
