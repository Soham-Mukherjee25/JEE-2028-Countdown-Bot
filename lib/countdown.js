function getCountdownData() {
  // Step 1: Get current UTC time reliably
  const nowUTC = new Date();

  // Step 2: Derive IST time by adding +5:30 offset manually
  // This avoids toLocaleString() + new Date() parsing, which is unreliable in Node.js
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
  const nowIST = new Date(nowUTC.getTime() + IST_OFFSET_MS);

  // Step 3: Build "today midnight IST" as a UTC timestamp
  // nowIST.getUTCFullYear/Month/Date gives us the IST calendar date
  // because we manually shifted the clock above
  const todayMidnightIST = new Date(
    Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate())
  );

  // Step 4: Target = 20th January 2028, 00:00 IST = 19th January 2028, 18:30 UTC
  const targetMidnightIST = new Date(Date.UTC(2028, 0, 19, 18, 30, 0));

  // Step 5: Days left — whole days from today midnight IST to target midnight IST
  const msLeft = targetMidnightIST - todayMidnightIST;
  const daysLeft = Math.round(msLeft / (1000 * 60 * 60 * 24));

  // Step 6: Weeks — complete weeks remaining + leftover days
  const weeksLeft = Math.floor(daysLeft / 7);
  const extraDays = daysLeft % 7;

  const todayFormatted = formatDate(nowIST);

  return { todayFormatted, daysLeft, weeksLeft, extraDays };
}

function formatDate(date) {
  // date is already shifted to IST, so use UTC getters
  const day = date.getUTCDate();
  const suffix = getOrdinalSuffix(day);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
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
