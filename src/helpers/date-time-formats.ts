import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const getDateTimeFormat = (date: any) => {
  return dayjs(date).fromNow();
};