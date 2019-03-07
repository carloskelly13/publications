import { isToday, format, differenceInCalendarISOWeeks } from "date-fns";

export const capitalizeString = (sender: string): string =>
  `${sender.charAt(0).toUpperCase()}${sender.slice(1)}`;

export const lastModifiedString = (date: string): string => {
  if (isToday(date)) {
    return format(date, "[Today at] H:mm a");
  } else if (differenceInCalendarISOWeeks(date, new Date()) >= -1) {
    return format(date, "dddd");
  }
  return format(date, "MMM D");
};

export const documentName = (name: string): string =>
  name.length <= 20 ? name : `${name.substring(0, 14)}…`;
