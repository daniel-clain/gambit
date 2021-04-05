import { AbilityData } from "../../game-components/abilities-reformed/ability"
import { Bet } from "../../interfaces/game/bet"
import { ClientNameAndID } from "../../game-host/game-host.types"
import { SetStateManagerUIFunctionName, SetStateManagerUI } from "../front-end-state/reducers/manager-ui.reducer"
import { SetStatePreGameUIFunctionName, SetStatePreGameUI } from "../front-end-state/reducers/pre-game-ui.reducer"

export type FromClientToGame = {
  toggleReady()
  betOnFighter(bet: Bet)
  borrowMoney(amount: number)
  payBackMoney(amount: number)
  abilityConfirmed(ability: AbilityData)
  toggleDropPlayer({}: {
    votingPlayer: ClientNameAndID,
    disconnectedPlayer: ClientNameAndID,
    vote: boolean
  })
}

export type SetStateFunctionName = SetStatePreGameUIFunctionName | SetStateManagerUIFunctionName



export type SetState = SetStatePreGameUI & SetStateManagerUI