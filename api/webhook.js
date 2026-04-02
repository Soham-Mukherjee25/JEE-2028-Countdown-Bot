const { getCountdownData } = require("../lib/countdown.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  try {
    const { message } = req.body;

    if (!message || !message.text) {
      return res.status(200).json({ ok: true });
    }

    const text = message.text.trim().toLowerCase();
    const chatId = message.chat.id;

    if (text === "/countdown" || text.startsWith("/countdown@")) {
      const data = getCountdownData();
      const reply = formatCountdownReply(data);
      await sendMessage(chatId, reply);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(200).json({ ok: true });
  }
};

function formatCountdownReply(data) {
  return (
    `⏳ JEE Main 2028 Countdown\n\n` +
    `📅 Today: ${data.todayFormatted}\n` +
    `🎯 Estimated Target: 20th January 2028\n` +
    `⏳ Days Left: ${data.daysLeft}\n` +
    `📆 Weeks Left: ${data.weeksLeft} weeks to go\n\n` +
    `Keep going. 🔥`
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
