import { isToday, format } from "date-fns"

export const capitalizeString = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

export const lastModifiedString = date => {
  if (isToday(date)) {
    return "Today"
  }
  return format(date, "dddd")
}
