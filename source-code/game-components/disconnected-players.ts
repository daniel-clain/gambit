import Game from "./game"
import PlayerNameAndId from "../interfaces/player-name-and-id"
import { DisconnectedPlayerVote } from "../interfaces/server-game-ui-state.interface"
import { Subject } from "rxjs"
import { Socket } from "socket.io"

 export default class ConnectionManager {

  constructor(public game: Game){}
   
  disconnectedPlayers: PlayerNameAndId[] = []
  disconnectedPlayerVotes: DisconnectedPlayerVote[] = []
  playerDisconnectedSubject: Subject<void> = new Subject()

  
  playerDisconnected(disconnectingPlayer: PlayerNameAndId){
    this.game.pause()

    if(this.disconnectedPlayers.length == 0){
      this.disconnectedPlayerVotes =
      this.game.players
      .filter(player => player.id !== disconnectingPlayer.id)
      .map(player => {
        return  {
          player: {name: player.name, id: player.id},
          playerVotesToDrop: [{
            disconnectedPlayer: disconnectingPlayer,
            drop: false
          }]
        }
      })
    }
    
    if(this.disconnectedPlayers.length > 0){
      const disconnectingPlayerIndex = this.disconnectedPlayerVotes.findIndex(playerVotes => playerVotes.player.id == disconnectingPlayer.id)
      this.disconnectedPlayerVotes.splice(disconnectingPlayerIndex, 1)

      this.disconnectedPlayerVotes.forEach(playerVotes => {
        playerVotes.playerVotesToDrop.push({
          disconnectedPlayer: disconnectingPlayer,
          drop: false
        })
      })
      
    }

    
    this.disconnectedPlayers.push(disconnectingPlayer)

    this.playerDisconnectedSubject.next()
  }
  
  playerReconnected(reconnectingPlayer: PlayerNameAndId, socket: Socket){
    const player = this.game.players.find(player => player.id == reconnectingPlayer.id)

    player.socketObj = socket
    const disconnectedPlayerIndex = this.disconnectedPlayers.findIndex(disconnectedPlayer => disconnectedPlayer.id == reconnectingPlayer.id)
    this.disconnectedPlayers.splice(disconnectedPlayerIndex, 1)
    

    if(this.disconnectedPlayers.length == 0){
      this.disconnectedPlayerVotes = []
      this.game.unpause()
    }
    else{
      this.disconnectedPlayerVotes.forEach(playerVotes => {
        const playerVotesToDropIndex = playerVotes.playerVotesToDrop.findIndex(disconnectedPlayerVote => 
          disconnectedPlayerVote.disconnectedPlayer.id == reconnectingPlayer.id
        )
        playerVotes.playerVotesToDrop.splice(playerVotesToDropIndex, 1)
      })
      this.disconnectedPlayerVotes.push( {
        player: reconnectingPlayer,
        playerVotesToDrop: this.disconnectedPlayers.map(disconnectedPlayer => {
          return {
            disconnectedPlayer,
            drop: false
          }
        })
      })
    }

    this.playerDisconnectedSubject.next()

  }

  playerVoteToggle(votingPlayer: PlayerNameAndId, disconnectedPlayer: PlayerNameAndId, vote: boolean){

    const playerVote = this.disconnectedPlayerVotes.find(playerVotes => playerVotes.player.id == votingPlayer.id)

    const disconnectedPlayerVote = playerVote.playerVotesToDrop.find(playerVote => playerVote.disconnectedPlayer.id == disconnectedPlayer.id)

    disconnectedPlayerVote.drop = vote

    this.checkIfAllPlayersDropDisconnectedPlayer()

    this.playerDisconnectedSubject.next()
  }


  checkIfAllPlayersDropDisconnectedPlayer(){
    const disconnectedPlayersVotedOut: {
      disconnectedPlayer: PlayerNameAndId,
      allVoteToDrop: boolean
    }[] = this.disconnectedPlayerVotes[0].playerVotesToDrop.map(disconnectedPlayerVote => ({disconnectedPlayer: disconnectedPlayerVote.disconnectedPlayer, allVoteToDrop: disconnectedPlayerVote.drop}))

    this.disconnectedPlayerVotes.forEach(playerVote => {
      playerVote.playerVotesToDrop.forEach(playersDisconnectedPlayerVote => {
        
        const voteOutPlayer = disconnectedPlayersVotedOut.find(disconnectedPlayersVotedOut => disconnectedPlayersVotedOut.disconnectedPlayer.id == playersDisconnectedPlayerVote.disconnectedPlayer.id)

        if(voteOutPlayer.allVoteToDrop == true && playersDisconnectedPlayerVote.drop == false){
          voteOutPlayer.allVoteToDrop = false
        }
      })
    })

    disconnectedPlayersVotedOut.forEach(disconnectedPlayersVotedOut => {
      if(disconnectedPlayersVotedOut.allVoteToDrop){
        this.dropDisconnectedPlayer(disconnectedPlayersVotedOut.disconnectedPlayer)
      }
    })

  }

  dropDisconnectedPlayer(droppedPlayer: PlayerNameAndId){
    /* const player = this.game.playersUpdateCommunicatorsWebsocket.findIndex(playerCommunicator => playerCommunicator.id == droppedPlayer.id)

    this.game.playersUpdateCommunicatorsWebsocket.splice(indexOfPlayerCommunicator, 1)

    const disconnectedPlayerIndex = this.disconnectedPlayers.findIndex(disconnectedPlayer => disconnectedPlayer.id == droppedPlayer.id)
    this.disconnectedPlayers.splice(disconnectedPlayerIndex, 1)

    this.disconnectedPlayerVotes.forEach(playersVote => {
      const disconnectedPlayerVoteIndex = playersVote.playerVotesToDrop.findIndex(disconnectedPlayerVote => disconnectedPlayerVote.disconnectedPlayer.id == droppedPlayer.id)
      playersVote.playerVotesToDrop.splice(disconnectedPlayerVoteIndex, 1)
    })

    const managerIndex = this.game.managers.findIndex(manager => manager.id == droppedPlayer.id)
    this.game.managers.splice(managerIndex, 1)


    if(this.disconnectedPlayers.length == 0){
      this.disconnectedPlayerVotes = []
      this.game.unPauseGame()
    } */

  }

 };
  