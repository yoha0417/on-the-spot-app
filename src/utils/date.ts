export function parseLocalDate(dateString: string): Date {
  // If the string contains timezone offset (Z, +, - after T), use standard parsing
  if (/[+\-Z]\d{2}:\d{2}$/.test(dateString) || dateString.endsWith('Z')) {
    return new Date(dateString);
  }
  // Otherwise, assume local time and parse manually
  const parts = dateString.split(/[-T:]/);
  if (parts.length >= 6) {
    const [year, month, day, hour, minute, second] = parts.map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }
  // fallback
  return new Date(dateString);
}

export function formatLocalDateTime(dateString: string): string {
  const date = parseLocalDate(dateString);
  return date.toLocaleString();
}
