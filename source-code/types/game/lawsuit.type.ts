
import { Manager, ManagerInfo } from "../../game-components/manager"
import { IllegalActivityName, Evidence } from "./evidence.type"

export type LawsuitAccount = {
  name: IllegalActivityName,
  evidence: Evidence[]
}

export type Lawsuit = {
  prosecutingManager: ManagerInfo,
  prosecutedManager: ManagerInfo,
  accounts: LawsuitAccount[]
}