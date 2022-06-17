export function isAvailable(availibilities: (Availibility & { term: Term })[]) {
  let available = false;
  const now = new Date();
  const weekDay = (new Date().getDay() + 6) % 7;
  for (const availability of availibilities) {
    if (!isDateInRange(availability.term.start_date, availability.term.end_date))
      continue;
    if (availability.day_of_week !== weekDay) continue;
    console.log(availability);
    const startTime = new Date(availability.start_time);
    const endTime = new Date(availability.end_time);
    const minutesStart = startTime.getHours() * 60 + startTime.getMinutes();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const minutesEnd = endTime.getHours() * 60 + endTime.getMinutes();
    if (minutesStart <= minutesNow && minutesNow <= minutesEnd) {
      available = true;
      break;
    }
  }
  return available;
}

export function availableIn(availibilities: (Availibility & { term: Term })[]) {
  let earliestAvailibility;

  for (const a of availibilities) {
  }

  return earliestAvailibility;
}

export function isDateInRange(start_date: Date, end_date: Date | null) {
  const start = new Date(start_date);
  const end = new Date(end_date!);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 9999);
  return start < new Date() && (end_date === null || new Date() < end);
}

function dateDiff(start: Date, end: Date | null) {
  const now = new Date();
  if (end !== null && end < now) return -1;

  if (start < now && (end === null || now < end)) return 0;

  return start.getTime() - now.getTime();
}

// 0 - 6 (mon - sun)
function weekdayDiff(start: number, end: number) {
  const diff = end - start;
  if (diff >= 0) return diff;
  return 6 - diff;
}
