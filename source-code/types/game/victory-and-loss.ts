import { ManagerInfo } from "../../game-components/manager"
import { FighterInfo } from "../../interfaces/front-end-state-interface"
import { ManagerImage } from "./manager-image"
import { VictoryType } from "./victory-type"

export type PlayerHasVictory = {
  sourceManager: ManagerInfo
  victoryType: VictoryType
}

export type PlayerHasFailedVictory = {
  sourceManager: ManagerInfo
  victoryType: Extract<VictoryType, "Sinister Victory" | "Wealth Victory">
}

export type Winner = { name: string; victoryType: VictoryType }

export type PlayerInfo = {
  name: string
  money: number
  managerImage: ManagerImage
  fighters: FighterInfo[]
}
