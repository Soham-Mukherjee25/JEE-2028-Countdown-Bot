function getCountdownData() {
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const target = new Date("2028-01-20T00:00:00+05:30");
  const msLeft = target - nowIST;
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  const weeksLeft = Math.ceil(daysLeft / 7);
  const todayFormatted = formatDate(nowIST);

  return { todayFormatted, daysLeft, weeksLeft };
}

function formatDate(date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString("en-IN", { month: "long" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

module.exports = { getCountdownData };
