export const weekList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getDateFormatted = (date: Date, separator: string = "-") => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
};

export const getSlotNumber = (hourSlot: number, minuteSlot: number): number => {
  return hourSlot * 2 + (minuteSlot === 0 ? 0 : 1);
};

export const getTimeFromSlot = (slot: number): string => {
  const remainder = slot % 2;
  const result = Math.floor(slot / 2).toString().padStart(2, "0");
  if (remainder == 1) return result + "30";
  return result + "00";
};
