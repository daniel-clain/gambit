import { AbilityData } from "../../game-components/abilities-general/ability"
import { Bet } from "../../interfaces/game/bet"
import { ClientNameAndID } from "../../game-host/game-host.types"
import {  SetStateManagerUI } from "../front-end-state/reducers/manager-ui.reducer"
import { SetStatePreGameUI } from "../front-end-state/reducers/pre-game-ui.reducer"

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

export type SetStatePreGameUIFunctionName = 'setName'

export type SetStateManagerUIFunctionName = 
'showFighter' | 'showEmployee' | 'showJobSeeker' | 'showAbility' | 'showManager' | 'showLoanShark' | 'showKnownFighters' | 'showOtherManagers' | 'closeModal' | 'closeSelectList' | 'showReport' | 'showWinOptions'

export type SetState = SetStatePreGameUI & SetStateManagerUI