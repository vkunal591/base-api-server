

export const sendMail = async () => {
  console.log("Running invoice due email job...");
  try {
    const res = await fetch("https://sud-group-dock.vercel.app/api/jobs");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error running cron job:", err);
  }
}
