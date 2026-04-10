const { getCountdownData } = require("../lib/countdown.js");

module.exports = async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { type } = req.query;
    const chatId = process.env.TELEGRAM_GROUP_ID;
    const data = getCountdownData();

    let message = "";
    if (type === "weekly") {
      message = formatWeeklyMessage(data);
    } else {
      message = formatDailyMessage(data);
    }

    await sendMessage(chatId, message);
    return res.status(200).json({ ok: true, type, sent: message });
  } catch (err) {
    console.error("Cron error:", err);
    return res.status(500).json({ error: err.message });
  }
};

function formatDailyMessage(data) {
  return (
    `📅 JEE Main 2028 — Daily Reminder\n\n` +
    `🗓️ Today: ${data.todayFormatted}\n` +
    `⏳ Days Left: ${data.daysLeft}\n` +
    `📆 Weeks Left: ${data.weeksLeft} weeks ${data.extraDays > 0 ? `+ ${data.extraDays} day${data.extraDays > 1 ? "s" : ""}` : ""}\n\n` +
    `🎯 Estimated Target: 20th January 2028\n\n` +
    `✅ One more day went. ${data.daysLeft} to go.\n` +
    `Stay consistent. Every day counts.`
  );
}

function formatWeeklyMessage(data) {
  return (
    `🗓️ Weekly Check-in — JEE Main 2028\n\n` +
    `📅 Today: ${data.todayFormatted}\n` +
    `⏳ Days Left: ${data.daysLeft}\n` +
    `📆 Weeks Left: ${data.weeksLeft} weeks ${data.extraDays > 0 ? `+ ${data.extraDays} day${data.extraDays > 1 ? "s" : ""}` : ""}\n\n` +
    `🎯 Estimated Target: 20th January 2028\n\n` +
    `✅ One more week went. ${data.weeksLeft} weeks to go.\n` +
    `Make this one count. 💪`
  );
}

async function sendMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  });
  return response.json();
}
