import { AbilityData } from "../../../game-components/abilities-reformed/ability"
import { ActiveModal, Employee, JobSeeker, CardName, ClientManagerUIState } from "../../../interfaces/front-end-state-interface"
import { ActivityLogItem } from "../../../types/game/activity-log-item"
import { SetStateFunctionName } from "../../front-end-service/front-end-service-types"

export type ClientManagerUIActionType = 'Fighter Selected' | 'Jobseeker Selected' | 'Ability Selected' | 'Employee Selected' | 'Close Modal' | 'Manager Selected' | 'Show Loan Shark Card' | 'Show Activity Log' | 'Show Known Managers' | 'Show Known Fighters' | 'Close Select List'



export interface SetStateManagerUI {
  showFighter: (fighterName: string) => {activeModal: ActiveModal}
  showEmployee: (employee: Employee) => {activeModal: ActiveModal}
  showjobSeeker: (jobSeeker: JobSeeker) => {activeModal: ActiveModal}
  showAbility: (abilityData: AbilityData) => {activeModal: ActiveModal}
  showActivityLog: () => {activeModal: ActiveModal}
  showLoanShark:() => {activeModal: ActiveModal}
  showKnownFighters:() => {activeModal: ActiveModal}
  showOtherManagers:() => {activeModal: ActiveModal}
  closeModal:() => {activeModal: ActiveModal}
  closeSelectList:() => void
  showReport(): {activeModal: ActiveModal}
}

export type SetStateManagerUIFunctionName = 
'showFighter' | 'showEmployee' | 'showjobSeeker' | 'showAbility' | 'showActivityLog' | 'showLoanShark' | 'showKnownFighters' | 'showOtherManagers' | 'closeModal' | 'closeSelectList' | 'showReport'


export interface SetStateManagerUIAction{
  type: SetStateFunctionName
  payload?: any
}
const getModal = (cardName: CardName, data?): {activeModal: ActiveModal} => ({
  activeModal: {name: cardName, data}
})
/* fighterName => ({
  activeModal: {
    name: 'Fighter', data: fighterName 
  }
}) */
const setStateManagerUI: SetStateManagerUI = {

  showFighter: fighter => getModal('Fighter', fighter),
  showEmployee: employee => getModal('Employee', employee),
  showjobSeeker: jobSeeker => getModal('Job Seeker', jobSeeker),
  showAbility: abilityData => getModal('Ability', abilityData),
  showActivityLog: () => getModal('Activity Log'),
  showLoanShark: () => getModal('Loan Shark'),
  showKnownFighters: () => getModal('Known Fighters'),
  showOtherManagers: () => getModal('Known Managers'),
  closeModal: () => ({activeModal: null}),
  closeSelectList: () => ({selectListActive: false}),
  showReport: () => getModal('Manager Report')
}

export const clientManagerUIReducer = (
  clientManagerUIState: ClientManagerUIState = new ClientManagerUIState(), 
  {type, payload }: SetStateManagerUIAction
): ClientManagerUIState => setStateManagerUI?.[type] ? ({
  ...clientManagerUIState, ...setStateManagerUI[type](payload)
}) : clientManagerUIState

