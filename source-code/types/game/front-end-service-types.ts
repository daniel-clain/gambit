import { ClientNameAndID } from "../../backend/game-host/game-host.types"
import { AbilityData } from "../../game-components/abilities-general/ability"
import { Bet } from "../../interfaces/game/bet"

export type FromClientToGame = {
  toggleReady: () => void
  betOnFighter: (bet: Bet) => void
  borrowMoney: (amount: number) => void
  payBackMoney: (amount: number) => void
  abilityConfirmed: (ability: AbilityData) => void
  toggleDropPlayer: (dropPlayerObj: DropPlayerObj) => void
}

export type DropPlayerObj = {
  votingPlayer: ClientNameAndID
  disconnectedPlayer: ClientNameAndID
  vote: boolean
}

export type SetStateFunctionName =
  | SetStatePreGameUIFunctionName
  | SetStateManagerUIFunctionName

export type SetStatePreGameUIFunctionName = "setName"

export type SetStateManagerUIFunctionName =
  | "showFighter"
  | "showEmployee"
  | "showJobSeeker"
  | "showAbility"
  | "showManager"
  | "showLoanShark"
  | "showKnownFighters"
  | "showOtherManagers"
  | "closeModal"
  | "showReport"
  | "showWinOptions"
