/**
 * Time utilities for Sri Lanka timezone (GMT+5:30)
 * 
 * IMPORTANT: This application uses Sri Lanka local time (Asia/Colombo) exclusively.
 * All times from the server are already in Sri Lanka time.
 * These utilities ensure times are displayed correctly without browser timezone conversion.
 */

/**
 * Parse a time string (HH:MM) and return it as-is without timezone conversion
 * Server sends times in Sri Lanka timezone - display them directly
 */
export function formatTimeString(time: string): string {
  // If already in HH:MM format, return as-is
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  
  // If it's a datetime string, extract just the time portion
  // The server sends times in Sri Lanka timezone, so we extract without conversion
  if (time.includes(' ') || time.includes('T')) {
    const parts = time.split(/[T ]/);
    if (parts.length >= 2) {
      return parts[1].substring(0, 5); // Get HH:MM
    }
  }
  
  return time;
}

/**
 * Parse a datetime string and return date portion without timezone conversion
 * Server sends dates in Sri Lanka timezone
 */
export function formatDateString(datetime: string): string {
  if (datetime.includes(' ') || datetime.includes('T')) {
    const parts = datetime.split(/[T ]/);
    return parts[0]; // Return YYYY-MM-DD
  }
  return datetime;
}

/**
 * Format datetime to display friendly date (e.g., "Jan 26")
 * Parses the server time directly without timezone conversion
 */
export function formatDisplayDate(datetime: string): string {
  const dateStr = formatDateString(datetime);
  const [year, month, day] = dateStr.split('-').map(Number);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}`;
}

/**
 * Format time range for display (e.g., "11:30 - 12:00")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
}

/**
 * Get current Sri Lanka time
 * Note: This creates a Date in Sri Lanka timezone for display purposes
 */
export function getSriLankaTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' }));
}

/**
 * Get current Sri Lanka time as HH:MM string
 */
export function getCurrentSriLankaTimeString(): string {
  const now = getSriLankaTime();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get current Sri Lanka date as YYYY-MM-DD string
 */
export function getCurrentSriLankaDateString(): string {
  const now = getSriLankaTime();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format 24hr time to 12hr format with AM/PM (e.g., "11:30 AM")
 */
export function formatTo12Hour(time: string): string {
  const timeStr = formatTimeString(time);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Calculate end time given start time and duration in minutes
 * Returns HH:MM format
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = formatTimeString(startTime).split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}
