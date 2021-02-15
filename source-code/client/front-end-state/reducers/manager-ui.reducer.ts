import { AbilityData } from "../../../game-components/abilities-reformed/ability"
import { FighterInfo, Employee, JobSeeker } from "../../../interfaces/server-game-ui-state.interface"
import { SetStateFunctionName } from "../../front-end-service/front-end-service-types"

export type ClientManagerUIActionType = 'Fighter Selected' | 'Jobseeker Selected' | 'Ability Selected' | 'Employee Selected' | 'Close Modal' | 'Manager Selected' | 'Show Loan Shark Card' | 'Show Activity Log' | 'Show Known Managers' | 'Show Known Fighters' | 'Close Select List'

export class ClientManagerUIState{
  activeCard?
  selectListActive?: boolean
}

export class ClientGameUIState{
  clientManagerUIState: ClientManagerUIState
}



export type SetStateManagerUI = {
  showFighter(fighter: FighterInfo),
  showEmployee(employee: Employee),
  showjobSeeker(jobSeeker: JobSeeker),
  showAbility(ability: AbilityData),
  showActivityLog(),
  showLoanShark(),
  showKnownFighters(),
  showOtherManagers(),
  closeModal(),
  closeSelectList()
}

export type SetStateManagerUIFunctionName = 
'showFighter' | 'showEmployee' | 'showjobSeeker' | 'showAbility' | 'showActivityLog' | 'showLoanShark' | 'showKnownFighters' | 'showOtherManagers' | 'closeModal' | 'closeSelectList'



export type CardName = 'Loan Shark' | 'Known Fighters' | 'Known Managers' | 'Ability' | 'Fighter' | 'Employee' | 'Job Seeker' | 'Manager' | 'Activity Log'

export interface ActiveCard{
  name: CardName
  data?: any
}

export interface SetStateManagerUIAction{
  type: SetStateFunctionName
  payload?: any
}

const setStateManagerUI: SetStateManagerUI = {

  showFighter: (fighter: FighterInfo) => ({
    activeCard: {
      name: 'Fighter', data: fighter 
    }
  }),
  showEmployee: (employee: Employee) => ({
    activeCard: {
      name: 'Employee', data: employee 
    }
  }),
  showjobSeeker: (jobSeeker: JobSeeker) => ({
    activeCard: {
      name: 'Job Seeker', data: jobSeeker 
    }
  }),
  showAbility: (ability: AbilityData) => ({
    activeCard: {
      name: 'Ability', data: ability 
    }
  }),
  showActivityLog: () => ({activeCard: {name: 'Activity Log'}}),
  showLoanShark: () => ({activeCard: { name: 'Loan Shark'}}),
  showKnownFighters: () => ({activeCard: {name: 'Known Fighters'}}),
  showOtherManagers: () => ({activeCard: {name: 'Known Managers'}}),
  closeModal: () => ({activeCard: null}),
  closeSelectList: () => ({selectListActive: false})
}

export const clientManagerUIReducer = (
  clientManagerUIState: ClientManagerUIState = new ClientManagerUIState(), 
  {type, payload }: SetStateManagerUIAction
): ClientManagerUIState => setStateManagerUI?.[type] ? ({
  ...clientManagerUIState, ...setStateManagerUI[type](payload)
}) : clientManagerUIState

const SOME_OBJECT = <const>{
  "Hello": "World",
  "How": "Are",
  "You": "Today?"
}
type ObjectType = typeof SOME_OBJECT
type KeyObject = keyof ObjectType;
type KeyValue<T extends KeyObject> = ObjectType[T];
let x:KeyValue<'Hello'> = 'World';