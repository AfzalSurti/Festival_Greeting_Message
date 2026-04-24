// festivals.js
// All dates are in MM-DD format (Month-Day)
// Year is handled dynamically in the scheduler

const festivals = [
  // ─── JANUARY ───
  { date: "01-01", name: "New Year" },
  { date: "01-14", name: "Makar Sankranti" },
  { date: "01-14", name: "Pongal" },
  { date: "01-14", name: "Lohri" },
  { date: "01-26", name: "Republic Day" },

  // ─── FEBRUARY ───
  { date: "02-14", name: "Valentine's Day" },
  { date: "02-19", name: "Chhatrapati Shivaji Maharaj Jayanti" },
  { date: "02-26", name: "Maha Shivratri" }, // 2025 date

  // ─── MARCH ───
  { date: "03-14", name: "Holi" }, // 2025 date
  { date: "03-30", name: "Ram Navami" }, // 2025 date
  { date: "03-31", name: "Easter" }, // 2025 date

  // ─── APRIL ───
  { date: "04-06", name: "Ugadi / Gudi Padwa" }, // 2025 date
  { date: "04-10", name: "Hanuman Jayanti" }, // 2025 date
  { date: "04-14", name: "Ambedkar Jayanti" },
  { date: "04-14", name: "Tamil New Year (Puthandu)" },
  { date: "04-18", name: "Good Friday" }, // 2025 date

  // ─── MAY ───
  { date: "05-01", name: "Maharashtra Day / Labour Day" },
  { date: "05-12", name: "Buddha Purnima" }, // 2025 date
  { date: "05-11", name: "Mother's Day" }, // 2nd Sunday May 2025

  // ─── JUNE ───
  { date: "06-15", name: "Father's Day" }, // 3rd Sunday June 2025
  { date: "06-07", name: "Eid ul-Adha" }, // 2025 approx

  // ─── JULY ───
  { date: "07-06", name: "Rath Yatra" }, // 2025 date
  { date: "07-10", name: "Muharram" }, // 2025 approx

  // ─── AUGUST ───
  { date: "08-09", name: "Raksha Bandhan" }, // 2025 date
  { date: "08-15", name: "Independence Day" },
  { date: "08-16", name: "Janmashtami" }, // 2025 date
  { date: "08-27", name: "Ganesh Chaturthi" }, // 2025 date

  // ─── SEPTEMBER ───
  { date: "09-05", name: "Teachers Day" },
  { date: "09-07", name: "Onam" }, // 2025 approx
  { date: "09-05", name: "Milad-un-Nabi" }, // 2025 approx

  // ─── OCTOBER ───
  { date: "10-02", name: "Gandhi Jayanti" },
  { date: "10-02", name: "Navratri Begins" }, // 2025 date
  { date: "10-11", name: "Dussehra / Vijayadashami" }, // 2025 date
  { date: "10-20", name: "Diwali" }, // 2025 date
  { date: "10-22", name: "Bhai Dooj" }, // 2025 date
  { date: "10-31", name: "Halloween" },

  // ─── NOVEMBER ───
  { date: "11-05", name: "Chhath Puja" }, // 2025 date
  { date: "11-14", name: "Children's Day" },
  { date: "11-27", name: "Thanksgiving" }, // 4th Thursday Nov 2025

  // ─── DECEMBER ───
  { date: "12-25", name: "Christmas" },
  { date: "12-31", name: "New Year's Eve" },
];

module.exports = festivals;