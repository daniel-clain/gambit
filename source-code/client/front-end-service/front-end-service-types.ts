import { AbilityData } from "../../game-components/abilities-general/ability"
import { Bet } from "../../interfaces/game/bet"
import { ClientNameAndID } from "../../game-host/game-host.types"

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
