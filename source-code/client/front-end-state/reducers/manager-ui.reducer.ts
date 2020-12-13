
export type ClientManagerUIActionType = 'Fighter Selected' | 'Jobseeker Selected' | 'Ability Selected' | 'Employee Selected' | 'Close Modal' | 'Manager Selected' | 'Show Loan Shark Card' | 'Show Activity Log' | 'Show Known Managers' | 'Show Known Fighters' | 'Close Select List'

export interface ClientManagerUIState{
  activeCard?: ActiveCard
  selectListActive?: boolean
}

export interface ClientGameUIState{
  clientManagerUIState: ClientManagerUIState
}


export type CardName = 'Loan Shark' | 'Known Fighters' | 'Known Managers' | 'Ability' | 'Fighter' | 'Employee' | 'Job Seeker' | 'Manager' | 'Activity Log'

export interface ActiveCard{
  name: CardName
  data?: any
}

export interface ClientManagerUIAction{
  type: ClientManagerUIActionType
  payload?: any
}

export const clientManagerUIReducer = (clientManagerUIState: ClientManagerUIState = {activeCard: null}, {type, payload }: ClientManagerUIAction): ClientManagerUIState => {

  switch(type){
    case 'Fighter Selected':
      return {...clientManagerUIState, activeCard: {name: 'Fighter', data: payload}}

    case 'Jobseeker Selected': 
      return {...clientManagerUIState, activeCard: {name: 'Job Seeker', data: payload}}

    case 'Employee Selected': 
      return {...clientManagerUIState, activeCard: {name: 'Employee', data: payload}}

    case 'Ability Selected': 
      return {...clientManagerUIState, activeCard: {name: 'Ability', data: payload}}

    case 'Show Loan Shark Card': 
      return {...clientManagerUIState, activeCard: {name: 'Loan Shark', data: payload}}

    case 'Show Activity Log': 
      return {...clientManagerUIState, activeCard: {name: 'Activity Log', data: payload}}

    case 'Show Known Managers': 
      return {...clientManagerUIState, activeCard: {name: 'Known Managers', data: payload}}

    case 'Show Known Fighters': 
      return {...clientManagerUIState, activeCard: {name: 'Known Fighters', data: payload}}

    case 'Manager Selected': 
      return {...clientManagerUIState, activeCard: {name: 'Manager', data: payload}}

    case 'Close Modal': 
      return {...clientManagerUIState, activeCard: null}

    case 'Close Select List': 
      return {...clientManagerUIState, selectListActive: false}

    default: return clientManagerUIState
  }
}