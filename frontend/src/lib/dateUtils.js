/**
 * Shared date formatting utilities
 * Provides consistent date/time formatting across the application
 */

/**
 * Format a date to French locale date string
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    return dateObj.toLocaleDateString("fr-FR", { ...defaultOptions, ...options });
};

/**
 * Format a time to French locale time string
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions = {
        hour: "2-digit",
        minute: "2-digit"
    };
    return dateObj.toLocaleTimeString("fr-FR", { ...defaultOptions, ...options });
};

/**
 * Format a date and time to French locale strings
 * @param {Date|string} date - Date object or ISO string
 * @returns {Object} Object with date and time strings
 */
export const formatDateTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return {
        date: formatDate(dateObj),
        time: formatTime(dateObj)
    };
};

/**
 * Format a date range for display
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const startDateStr = formatDate(start);
    const startTime = formatTime(start);
    const endTime = formatTime(end);

    return `${startDateStr} ${startTime} - ${endTime}`;
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date in ISO format
 */
export const getTodayISO = () => {
    return new Date().toISOString().split("T")[0];
};

/**
 * Get a future date in ISO format
 * @param {number} daysFromNow - Number of days from today
 * @returns {string} Future date in ISO format
 */
export const getFutureDateISO = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
};

/**
 * Format time from hours and minutes
 * @param {number} hours - Hours
 * @param {number} minutes - Minutes
 * @returns {string} Formatted time string (HH:MM)
 */
export const formatTimeFromComponents = (hours, minutes = 0) => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

/**
 * Get day of week from date (0 = Sunday, 1 = Monday, etc.)
 * @param {Date|string} date - Date object or ISO string
 * @returns {number} Day of week
 */
export const getDayOfWeek = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getDay();
};

/**
 * Calculate duration between two dates
 * @param {Date|string} start - Start date
 * @param {Date|string} end - End date
 * @returns {string} Duration string (e.g., "2h 30min")
 */
export const calculateDuration = (start, end) => {
    const startDate = typeof start === 'string' ? new Date(start) : start;
    const endDate = typeof end === 'string' ? new Date(end) : end;

    const duration = endDate - startDate;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
};

/**
 * Convert date to ISO string for debugging/logging
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} ISO string
 */
export const toISOString = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
};

/**
 * Get next hour time for minimum booking validation
 * @param {Date} now - Current date
 * @returns {string} Next hour formatted time
 */
export const getNextHourTime = (now = new Date()) => {
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    return formatTimeFromComponents(nextHour.getHours());
};

/**
 * Format date with custom options for dashboard display
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDateWithOptions = (date, options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("fr-FR", options);
};