import {
  ClientNameAndID,
  ConnectedClient,
} from "../backend/game-host/game-host.types"
import { DisconnectedPlayerVote } from "../interfaces/front-end-state-interface"
import { Game } from "./game"

export default class ConnectionManager {
  disconnectedPlayerVotes: DisconnectedPlayerVote[]
  tearDownTimeOut: NodeJS.Timeout
  tearDownTime = 30
  constructor(public game: Game) {
    this.disconnectedPlayerVotes = []
  }

  handleClientDisconnect = (disconnectedClient: ClientNameAndID) => {
    const thisClass = this
    const { has, functions } = thisClass.game
    functions.pause()
    console.log(
      `${disconnectedClient.name} has disconnected, the game is now paused until ${disconnectedClient.name} reconnects or all players vote this client out`
    )

    addDisconnectedObjectToArray()
    removeDisconnectedPlayersVote()
    if (allPlayersArDisconnected()) {
      startTearDownTimer()
    }

    this.game.functions.triggerUIUpdate()

    /* implementation */

    function addDisconnectedObjectToArray() {
      thisClass.disconnectedPlayerVotes.push({
        disconnectedPlayer: disconnectedClient,
        playerVotesToDrop: has.players
          .filter(
            (p) =>
              !thisClass.disconnectedPlayerVotes.some(
                (d) => d.disconnectedPlayer.id == p.id
              ) && p.id != disconnectedClient.id
          )
          .map((p) => ({
            drop: false,
            votingPlayer: { name: p.name, id: p.id },
          })),
      })
    }

    function removeDisconnectedPlayersVote() {
      thisClass.disconnectedPlayerVotes.forEach((disconnectedPlayerVote) => {
        const index = disconnectedPlayerVote.playerVotesToDrop.findIndex(
          (p) => p.votingPlayer.id == disconnectedClient.id
        )
        index != -1 && disconnectedPlayerVote.playerVotesToDrop.splice(index, 1)
      })
    }
    function allPlayersArDisconnected() {
      return thisClass.disconnectedPlayerVotes.length == has.players.length
    }

    function startTearDownTimer() {
      thisClass.tearDownTimeOut = setTimeout(() => {
        thisClass.game.functions.tearDownGame()
      }, thisClass.tearDownTime * 1000)
    }
  }

  gameDisplayReconnected(reconnectingDisplay: ConnectedClient) {}

  playerReconnected(reconnectingPlayer: ConnectedClient) {
    const thisClass = this

    console.log(`${reconnectingPlayer.name} has reconnected to the game`)
    reconnectPlayerSocket()
    removePlayerFromDisconnectedPlayerArray()
    if (otherPlayersAreDisconnected()) {
      addReconnectedPlayerVoteObj()
    } else {
      this.game.functions.unPause()
      this.game.functions.triggerUIUpdate()
    }
    this.game.functions.triggerUIUpdate()

    /* implementation */

    function reconnectPlayerSocket() {
      const player = thisClass.game.has.players.find(
        (p) => p.id == reconnectingPlayer.id
      )!
      player.socket = reconnectingPlayer.socket!
      player.mapSocketMessagesToActions()
    }

    function removePlayerFromDisconnectedPlayerArray() {
      const index = thisClass.disconnectedPlayerVotes.findIndex(
        (d) => d.disconnectedPlayer.id == reconnectingPlayer.id
      )
      thisClass.disconnectedPlayerVotes.splice(index, 1)
    }

    function otherPlayersAreDisconnected() {
      return thisClass.disconnectedPlayerVotes.length
    }

    function addReconnectedPlayerVoteObj() {
      thisClass.disconnectedPlayerVotes.forEach((d) => {
        d.playerVotesToDrop.push({
          drop: false,
          votingPlayer: {
            name: reconnectingPlayer.name,
            id: reconnectingPlayer.id,
          },
        })
      })
    }
    this.game.functions.triggerUIUpdate()
  }

  handlePlayerVote = (
    votingPlayer: ClientNameAndID,
    disconnectedPlayer: ClientNameAndID,
    vote: boolean
  ) => {
    const thisClass = this
    const disconnectedPlayerVotes = this.disconnectedPlayerVotes.find(
      (d) => d.disconnectedPlayer.id == disconnectedPlayer.id
    )!
    const votingPlayersVote = disconnectedPlayerVotes.playerVotesToDrop.find(
      (p) => p.votingPlayer.id == votingPlayer.id
    )!

    updatePlayersVote()
    if (allPlayersHaveVotedToDrop()) {
      dropDisconnectedPlayer()
      this.game.functions.updateGameHostClients()
    }
    if (!this.disconnectedPlayerVotes.length) {
      this.game.functions.unPause()
    }

    this.game.functions.triggerUIUpdate()

    /* implementation */

    function updatePlayersVote() {
      votingPlayersVote.drop = vote
    }

    function allPlayersHaveVotedToDrop() {
      return disconnectedPlayerVotes.playerVotesToDrop.every(
        (playersVote) => playersVote.drop
      )
    }

    function dropDisconnectedPlayer() {
      const { players, managers, professionals } = thisClass.game.has
      const managerIndex = managers.findIndex(
        (m) => m.has.name == disconnectedPlayer.name
      )
      const manager = managers[managerIndex]
      manager.has.employees.forEach(
        ({ actionPoints, activeContract, ...rest }) => {
          professionals.push(rest)
        }
      )
      manager.has.fighters.forEach((f) => {
        f.state.manager = undefined
        f.state.activeContract = undefined
      })
      managers.splice(managerIndex, 1)

      const playerIndex = players.findIndex(
        (p) => p.id == disconnectedPlayer.id
      )
      players.splice(playerIndex, 1)

      const index = thisClass.disconnectedPlayerVotes.findIndex(
        (d) => d.disconnectedPlayer.id == disconnectedPlayer.id
      )

      thisClass.disconnectedPlayerVotes.splice(index, 1)
    }
  }
}
