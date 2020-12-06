
import { AbilityData } from '../../../game-components/abilities-reformed/ability';
import { Employee, FighterInfo, JobSeeker } from '../../../interfaces/server-game-ui-state.interface';
import { DispatchAction, ModalName } from '../../front-end-state/front-end-state';
import { FrontEndService } from '../front-end-service';

export interface ManagerUIUtility{
  fighterSelected(fighter: FighterInfo): void
  jobSeekerSelected(jobSeeker: JobSeeker): void
  abilitySelected(abilityData: AbilityData): void
  getKnownFighter(name: string): FighterInfo
  employeeSelected(employee: Employee): void
  closeModal(): void
  openModal(name: ModalName): void
}

const getManagerUiUtility = (FES: FrontEndService ): ManagerUIUtility => {
  return {
    fighterSelected,
    jobSeekerSelected,
    employeeSelected,
    abilitySelected,
    getKnownFighter,
    closeModal,
    openModal
  }

  function openModal(name: ModalName){    
    const dispatchAction: DispatchAction = {
      type: 'Open Modal',
      payload: name
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }

  function closeModal(){    
    const dispatchAction: DispatchAction = {
      type: 'Close Modal'
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }



  function getKnownFighter(name): FighterInfo{
    let {knownFighters} = FES.frontEndStore.getState().serverGameUIState.playerManagerUiData.managerInfo
    return knownFighters.find(fighter => fighter.name == name)
    
  }

  function abilitySelected(abilityData: AbilityData){
    const dispatchAction: DispatchAction = {
      type: 'Jobseeker Selected', 
      payload: abilityData
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }

  function employeeSelected(employee: Employee){
    const dispatchAction: DispatchAction = {
      type: 'Employee Selected', 
      payload: employee
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }

  
  function jobSeekerSelected(jobSeeker: JobSeeker){
    const dispatchAction: DispatchAction = {
      type: 'Jobseeker Selected', 
      payload: jobSeeker
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }

  function fighterSelected(fighter: FighterInfo){
    const dispatchAction: DispatchAction = {
      type: 'Fighter Selected', 
      payload: fighter
    }
    FES.frontEndStore.dispatch(dispatchAction)
  }
}

export default getManagerUiUtility