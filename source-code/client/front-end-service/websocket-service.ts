import { runInAction } from "mobx"
import io from "socket.io-client"
import { ClientNameAndID } from "../../backend/game-host/game-host.types"
import { AbilityData } from "../../game-components/abilities-general/ability"
import {
  ServerGameUIState,
  ServerPreGameUIState,
} from "../../interfaces/front-end-state-interface"
import { Bet } from "../../interfaces/game/bet"
import { DropPlayerObj } from "../../types/game/front-end-service-types"
import { frontEndState } from "../front-end-state/front-end-state"
import { connectToGameHost } from "./front-end-service"

let socket: SocketIOClient.Socket

const clientToHostFunctions = {
  connectToHost: ({ name, id }: ClientNameAndID) => {
    console.log("connect fired")
    socket.emit("connectToHost", { name, id })
  },
  create: () => socket.emit("create"),
  testConnection: () => socket.emit("testConnection"),
  cancel: (gameId: number) => socket.emit("cancel", gameId),
  start: (gameId: number) => socket.emit("start", gameId),
  join: (gameId: number) => socket.emit("join", gameId),
  readyToStart: (gameId: number) => socket.emit("readyToStart", gameId),
  leave: (gameId: number) => socket.emit("leave", gameId),
  reJoin: (gameId: number) => socket.emit("reJoin", gameId),
  submitGlobalChat: (message: string) =>
    socket.emit("submitGlobalChat", message),
  reset: ({ name, id }: Partial<ClientNameAndID>) => {
    socket.emit("reset", { name, id })
  },
}

const clientToGameFunctions = {
  toggleReady: () => socket.emit("toggleReady"),
  betOnFighter: (bet: Bet) => socket.emit("betOnFighter", bet),
  borrowMoney: (amount: number) => socket.emit("borrowMoney", amount),
  payBackMoney: (amount: number) => socket.emit("payBackMoney", amount),
  abilityConfirmed: (ability: AbilityData) =>
    socket.emit("abilityConfirmed", ability),
  toggleDropPlayer: (obj: DropPlayerObj) => {
    socket.emit("toggleDropPlayer", obj)
  },
}

export const websocketService = {
  init() {
    const env = process.env.NODE_ENV
    console.log(`websocket service node env: ${process.env.NODE_ENV}`)

    if (env == "development") {
      socket = io("https://localhost:9999", {
        transports: ["websocket"],
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
      })

      socket.on("error", (x: any) => {
        console.log("error :>> ", x)
      })
      socket.on("reconnect", (x: any) => {
        console.log("reconnect :>> ", x)
      })
      socket.on("reconnect_error", (x: any) => {
        console.log("reconnect_error :>> ", x)
      })
      socket.on("reconnect_failed", (x: any) => {
        console.log("reconnect_failed :>> ", x)
      })
    } else {
      try {
        socket = io({
          secure: true,
          reconnection: true,
          rejectUnauthorized: false,
        })
      } catch (e) {
        console.log(e)
      }
    }

    try {
      socket.connect()

      socket.on("connect", (x: any) => {
        console.log("connect event :>> ", x)

        runInAction(() => {
          frontEndState.clientUIState.isConnectedToWebsocketServer = true
        })
        const { clientName } = frontEndState.clientUIState.clientPreGameUIState
        if (clientName) {
          connectToGameHost()
        }
      })

      socket.on("disconnect", (x: any) => {
        console.log("disconnect :>> ", x)
        runInAction(() => {
          frontEndState.clientUIState.isConnectedToWebsocketServer = false
        })
      })
    } catch (e) {
      console.log("e :>> ", e)
    }

    socket.on(
      "To Client From Server - Lobby Ui",
      (serverPreGameUIState: ServerPreGameUIState) => {
        console.log("serverPreGameUIState", serverPreGameUIState)
        runInAction(() => {
          frontEndState.serverUIState.serverPreGameUIState =
            serverPreGameUIState
          if (!frontEndState.clientUIState.isConnectedToGameHost) {
            frontEndState.clientUIState.isConnectedToGameHost = true
          }
        })
      }
    )
    socket.on(
      "To Client From Server - Game Ui",
      (serverGameUIState: ServerGameUIState) => {
        runInAction(() => {
          //console.log("serverGameUIState", serverGameUIState)
          frontEndState.serverUIState.serverGameUIState = serverGameUIState
          frontEndState.clientUIState.clientPreGameUIState.hasGameData = true
        })
      }
    )
  },
  sendUpdate: { ...clientToHostFunctions, ...clientToGameFunctions },
}
