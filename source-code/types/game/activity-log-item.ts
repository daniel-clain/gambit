import { LogItemTypes } from "./log-item-type";

export type ActivityLogItem = {
  message: string
  type?: LogItemTypes
  color1?: string
  color2?: string
  roundNumber: number
}