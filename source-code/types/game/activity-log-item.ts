import { LogItemTypes } from "./log-item-type";

export type ActivityLogItem = {
  message: string
  type?: LogItemTypes
}