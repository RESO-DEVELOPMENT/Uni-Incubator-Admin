import { format, lastDayOfMonth } from "date-fns";
import { isNil } from "lodash";

export const toDate = (date) => {
  if (isNil(date)) {
    return "N/A";
  }
  return format(new Date(date), "dd/MM/yyyy");
};

export const toDateWithTime = (date) => {
  if (isNil(date)) {
    return "N/A";
  }
  return format(new Date(date), "HH:mm - dd/MM/yyyy");
};

export const getLastDayOfMonth = (date) => {
  return format(lastDayOfMonth(new Date(date)), "dd/MM/yyyy");
};
