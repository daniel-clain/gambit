import { FighterInfo } from "../game-ui-state.interface";

import { ManagerWinnings } from "./manager-winnings";

export interface FightReport{
  draw?: boolean
  remainingFighters?: FighterInfo[]
  winner?: FighterInfo
  managerWinnings?: ManagerWinnings[]
}