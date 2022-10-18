
import { websocketService } from './websocket-service'
import { CardName, Employee, JobSeeker, Modal } from '../../interfaces/front-end-state-interface'
import { ActivityLogItem } from '../../types/game/activity-log-item';
import { runInAction } from 'mobx';
import { frontEndState } from '../front-end-state/front-end-state';
import { KnownManager } from '../../game-components/manager';
import { AbilityData } from '../../game-components/abilities-general/ability';

type ConnectionType = 'Local' | 'Websockets'


export const connectionType: ConnectionType = 'Websockets'

export function initialSetup(){

  websocketService.init()

  let clientId = localStorage.getItem('clientId')
  if(!clientId){    
    clientId = new Date().getTime().toString()
    localStorage.setItem('clientId', clientId)
  }

  runInAction(() => {
    frontEndState.clientUIState.clientPreGameUIState.clientId = clientId
  })

  let clientName = localStorage.getItem('clientName')
  if(clientName){    
    setNameAndTryToConnect(clientName)
  }


}

function setName(name: string){
  runInAction(() => {
    frontEndState.clientUIState.clientPreGameUIState.clientName = name
  })
}

export const setNameAndTryToConnect = name => {
  if(name){
    localStorage.setItem('clientName', name)
    setName(name)
    connectToGameHost()
  }
}
export function updateGameUi(){}

function setActiveModal(name: CardName | null, data?: unknown){
  let modalObj: Modal
  if(!name){
    modalObj = null
  }else{
    modalObj = {
      name,
      data
    }
  }
  runInAction(() => {
    frontEndState.clientUIState.clientGameUIState.clientManagerUIState.activeModal = modalObj
  })
}

export function convertThisManagerToKnownManager(): KnownManager{
  const {name, image, money, loan, employees, fighters, evidence} = frontEndState.serverUIState.serverGameUIState.playerManagerUIState.managerInfo
  return {
    name, image,
    characterType: 'Known Manager',
    money: {weeksSinceUpdated: null, lastKnownValue: money},
    loan: {weeksSinceUpdated: null, lastKnownValue: loan},
    employees: {weeksSinceUpdated: null, lastKnownValue: employees},
    fighters: {weeksSinceUpdated: null, lastKnownValue: fighters},
    evidence: {weeksSinceUpdated: null, lastKnownValue: evidence},
  }
}

export function showLoanShark(){
  setActiveModal('Loan Shark', )
}
export function showKnownFighters(){
  setActiveModal('Known Fighters')
}
export function showManager(managerName: string){
  setActiveModal('Manager', managerName)
}
export function showEmployee(employee: Employee){
  setActiveModal('Employee', employee)
}

export function showOtherManagers(){
  setActiveModal('Known Managers')
}
export function showReport(){
  setActiveModal('Manager Report')
}
export function showWinOptions(){
  setActiveModal('Win Options')
}
export function showGameExplanation(){
  setActiveModal('Game Explanation')
}
export function closeModal(){
  setActiveModal(null)
}
export function closeSelectList(){
  setActiveModal(null)
}
export function showFighter(fighterName: string){
  setActiveModal('Fighter', fighterName)
}
export function showJobSeeker(jobSeeker: JobSeeker){
  setActiveModal('Job Seeker', jobSeeker)
}
export function showAbility(abilityData: AbilityData){
  setActiveModal('Ability', abilityData)
}




export function connectToGameHost() {
  const {clientName, clientId} = frontEndState.clientUIState.clientPreGameUIState
  clientName ? websocketService.sendUpdate.connectToHost({name: clientName, id: clientId}) : alert('You must submit a name')
}

export function getSortedActivityLogs(): ActivityLogItem[]{
  const {activityLogs} = frontEndState.serverUIState.serverGameUIState.playerManagerUIState.managerInfo
  

  const sortedLogs = activityLogs.sort((a, b) => b.weekNumber - a.weekNumber)
  return sortedLogs
}

export function returnToLobby(){
  runInAction(() => 
    frontEndState.clientUIState.clientPreGameUIState.hasGameData = false
  )
}

