import { runInAction } from "mobx"
import { AbilityData } from "../../game-components/abilities-general/ability"
import {
  CardName,
  Employee,
  JobSeeker,
} from "../../interfaces/front-end-state-interface"
import { ActivityLogItem } from "../../types/game/activity-log-item"
import { frontEndState } from "../front-end-state/front-end-state"
import { websocketService } from "./websocket-service"

type ConnectionType = "Local" | "Websockets"

export const connectionType: ConnectionType = "Websockets"

export function initialSetup() {
  websocketService.init()

  let clientId = localStorage.getItem("clientId")
  if (!clientId) {
    clientId = new Date().getTime().toString()
    localStorage.setItem("clientId", clientId)
  }

  runInAction(() => {
    frontEndState.clientUIState.clientPreGameUIState.clientId = clientId!
  })

  let clientName = localStorage.getItem("clientName")
  if (clientName) {
    setName(clientName)
  }
}

function setName(name: string) {
  runInAction(() => {
    frontEndState.clientUIState.clientPreGameUIState.clientName = name
  })
}

export const setNameAndTryToConnect = (name: string | undefined) => {
  if (name) {
    localStorage.setItem("clientName", name)
    setName(name)
    connectToGameHost()
  }
}

function setActiveModal(name?: CardName, data?: unknown) {
  const modalObj = name && { name, data }
  const { clientManagerUIState } = frontEndState.clientUIState.clientGameUIState
  runInAction(() => {
    clientManagerUIState.activeModal = modalObj
  })
}

export function showLoanShark() {
  setActiveModal("Loan Shark")
}
export function showKnownFighters() {
  setActiveModal("Known Fighters")
}
export function showManager(managerName: string) {
  setActiveModal("Manager", managerName)
}
export function showEmployee(employee: Employee) {
  setActiveModal("Employee", employee)
}

export function showOtherManagers() {
  setActiveModal("Known Managers")
}
export function showReport() {
  setActiveModal("Manager Report")
}
export function showWinOptions() {
  setActiveModal("Win Options")
}
export function showGameExplanation() {
  setActiveModal("Game Explanation")
}
export function closeModal() {
  setActiveModal()
}
export function showFighter(fighterName: string) {
  setActiveModal("Fighter", fighterName)
}
export function showJobSeeker(jobSeeker: JobSeeker) {
  setActiveModal("Job Seeker", jobSeeker)
}
export function showAbility(abilityData: Partial<AbilityData>) {
  setActiveModal("Ability", abilityData)
}

export function connectToGameHost() {
  const { clientName, clientId } =
    frontEndState.clientUIState.clientPreGameUIState
  clientName
    ? websocketService.sendUpdate.connectToHost({
        name: clientName,
        id: clientId!,
      })
    : alert("You must submit a name")
}

export function getSortedActivityLogs(): ActivityLogItem[] {
  const { activityLogs } =
    frontEndState.serverUIState.serverGameUIState!.playerManagerUIState!
      .managerInfo

  const sortedLogs = activityLogs.sort((a, b) => b.weekNumber - a.weekNumber)
  return sortedLogs
}

export function returnToLobby() {
  runInAction(
    () => (frontEndState.clientUIState.clientPreGameUIState.hasGameData = false)
  )
}
export function resetClient() {
  runInAction(() => {
    frontEndState.clientUIState.clientPreGameUIState.hasGameData = false
    frontEndState.serverUIState = {
      serverPreGameUIState: undefined,
      serverGameUIState: undefined,
    }
  })
}

export function backButtonClicked() {
  localStorage.removeItem("clientName")
  localStorage.removeItem("clientId")
  const { clientId, clientName } =
    frontEndState.clientUIState.clientPreGameUIState
  websocketService.sendUpdate.reset({ name: clientName, id: clientId })

  runInAction(() => {
    frontEndState.clientUIState.isConnectedToGameHost = false
    frontEndState.clientUIState.clientPreGameUIState.clientName = undefined
  })
}
