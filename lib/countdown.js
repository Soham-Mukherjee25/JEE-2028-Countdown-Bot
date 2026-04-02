/**
 * Returns live countdown data calculated in IST (UTC+5:30)
 */
export function getCountdownData() {
  // Get current time in IST
  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  // Target: 20th January 2028 (Estimated JEE Main Session 1)
  const target = new Date("2028-01-20T00:00:00+05:30");

  // Days left (ceil so it counts today as a full day)
  const msLeft = target - nowIST;
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  const weeksLeft = Math.ceil(daysLeft / 7);

  // Format today's date nicely e.g. "2nd April, 2026"
  const todayFormatted = formatDate(nowIST);

  return {
    todayFormatted,
    daysLeft,
    weeksLeft,
  };
}

/**
 * Formats a Date object as "2nd April, 2026"
 */
function formatDate(date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleString("en-IN", { month: "long" });
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

/**
 * Returns ordinal suffix: st, nd, rd, th
 */
function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
