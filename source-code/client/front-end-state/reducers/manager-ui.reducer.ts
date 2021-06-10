
import { AbilityData } from "../../../game-components/abilities-general/ability"
import { KnownManager } from "../../../game-components/manager"
import { ActiveModal, CardName, ClientManagerUIState, Employee, FighterInfo, JobSeeker } from "../../../interfaces/front-end-state-interface"
import { SetStateFunctionName } from "../../front-end-service/front-end-service-types"

export type ClientManagerUIActionType = 'Fighter Selected' | 'Jobseeker Selected' | 'Ability Selected' | 'Employee Selected' | 'Close Modal' | 'Manager Selected' | 'Show Loan Shark Card' | 'Show Activity Log' | 'Show Known Managers' | 'Show Known Fighters' | 'Close Select List'



export class SetStateManagerUI {
  showFighter = (fighter: string) => this.getModal('Fighter', fighter)
  showEmployee = (employee: Employee) => this.getModal('Employee', employee)
  showJobSeeker = (jobSeeker: JobSeeker) => this.getModal('Job Seeker', jobSeeker)
  showAbility = (abilityData: AbilityData) => this.getModal('Ability', abilityData)
  showManager = (knownManager: KnownManager) => this.getModal('Manager', knownManager)
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
'showFighter' | 'showEmployee' | 'showJobSeeker' | 'showAbility' | 'showManager' | 'showLoanShark' | 'showKnownFighters' | 'showOtherManagers' | 'closeModal' | 'closeSelectList' | 'showReport'


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

