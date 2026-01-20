import cron from "node-cron";
import fetch from "node-fetch";

cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Invoice Reminder Cron Running");

    await fetch("http://localhost:3000/api/notification", {
      method: "POST",
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
});
