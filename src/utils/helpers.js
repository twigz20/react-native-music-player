export const buildTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const minutesStr = String(minutes);
  const secondsStr = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${minutesStr.padStart(2, "0")}:${secondsStr}`;
  }

  return `${minutesStr}:${secondsStr}`;
};

export const getTotalMinutes = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);

  const minutesStr = String(minutes);

  return `${minutesStr} minute${minutes > 0 ? "s" : ""}`;
};
