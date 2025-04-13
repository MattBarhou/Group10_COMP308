export function formatDate(dateString, format = "medium") {
  if (!dateString) return "";

  const date = new Date(dateString);

  const formats = {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    medium: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    long: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
    },
    dateTime: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    relative: {}, // Handled differently
  };

  if (format === "relative") {
    return getRelativeTimeString(date);
  }

  return date.toLocaleDateString("en-US", formats[format]);
}

export function getRelativeTimeString(date) {
  // ms to seconds
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000; // seconds in a year

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function isDateInFuture(dateString) {
  const date = new Date(dateString);
  return date > new Date();
}

export function isDateInPast(dateString) {
  const date = new Date(dateString);
  return date < new Date();
}

export function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function getDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.toDateString() === end.toDateString()) {
    return `${formatDate(start, "medium")} ${start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return `${formatDate(start, "medium")} - ${formatDate(end, "medium")}`;
}
