import { AbilityData } from "../../../game-components/abilities-reformed/ability"
import { ActiveModal, Employee, JobSeeker, CardName, ClientManagerUIState } from "../../../interfaces/front-end-state-interface"
import { ActivityLogItem } from "../../../types/game/activity-log-item"
import { SetStateFunctionName } from "../../front-end-service/front-end-service-types"

export type ClientManagerUIActionType = 'Fighter Selected' | 'Jobseeker Selected' | 'Ability Selected' | 'Employee Selected' | 'Close Modal' | 'Manager Selected' | 'Show Loan Shark Card' | 'Show Activity Log' | 'Show Known Managers' | 'Show Known Fighters' | 'Close Select List'



export class SetStateManagerUI {
  showFighter = fighter => this.getModal('Fighter', fighter)
  showEmployee = employee => this.getModal('Employee', employee)
  showjobSeeker = jobSeeker => this.getModal('Job Seeker', jobSeeker)
  showAbility = abilityData => this.getModal('Ability', abilityData)
  showManagerOptions = () => this.getModal('Manager')
  showLoanShark = () => this.getModal('Loan Shark')
  showKnownFighters = () => this.getModal('Known Fighters')
  showOtherManagers = () => this.getModal('Known Managers')
  showReport = () => this.getModal('Manager Report')
  closeModal = () => ({activeModal: null})
  closeSelectList = () => ({selectListActive: false})
  
  getModal(cardName: CardName, data?): {activeModal: ActiveModal}{
    return {activeModal: {name: cardName, data}}
  }

}

export type SetStateManagerUIFunctionName = 
'showFighter' | 'showEmployee' | 'showjobSeeker' | 'showAbility' | 'showManagerOptions' | 'showLoanShark' | 'showKnownFighters' | 'showOtherManagers' | 'closeModal' | 'closeSelectList' | 'showReport'


export interface SetStateManagerUIAction{
  type: SetStateFunctionName
  payload?: any
}

const setStateManagerUI = new SetStateManagerUI()

export const clientManagerUIReducer = (
  clientManagerUIState: ClientManagerUIState = new ClientManagerUIState(), 
  {type, payload }: SetStateManagerUIAction
): ClientManagerUIState => setStateManagerUI?.[type] ? ({
  ...clientManagerUIState, ...setStateManagerUI[type](payload)
}) : clientManagerUIState

