export function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function getDailySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function generateDailyDates(count: number = 5) {
  const seed = getDailySeed();
  const rng = mulberry32(seed);
  const dates = [];
  
  for (let i = 0; i < count; i++) {
    const year = Math.floor(rng() * (2199 - 1800 + 1)) + 1800;
    const month = Math.floor(rng() * 12) + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const day = Math.floor(rng() * daysInMonth) + 1;
    dates.push({ year, month, day });
  }
  
  return dates;
}
