import {
  isToday, format, differenceInCalendarISOWeeks
} from "date-fns"

export const capitalizeString = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

export const lastModifiedString = date => {
  if (isToday(date)) {
    return format(date, "[Today at] H:mm a")
  } else if (differenceInCalendarISOWeeks(date, new Date()) >= -1) {
    return format(date, "dddd")
  }
  return format(date, "MMM D")
}
