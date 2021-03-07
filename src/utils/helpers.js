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

export const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
