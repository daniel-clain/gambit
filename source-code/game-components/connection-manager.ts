
import { DisconnectedPlayerVote } from "../interfaces/server-game-ui-state.interface"
import { Game } from "./game"
import ClientGameAction from "../types/client-game-actions"
import { ClientNameAndID, ConnectedClient } from "../server/game-host.types"

 export default class ConnectionManager {

  constructor(public game: Game){}
   
  disconnectedClients: ClientNameAndID[] = []
  disconnectedPlayerVotes: DisconnectedPlayerVote[] = []

  
  handleClientDisconnect(disconnectedClient: ClientNameAndID){
    this.game.functions.pause()
    console.log(`${disconnectedClient.name} has disconnected, the game is now paused until ${disconnectedClient.name} reconnects of all players vote this client out`)

    if(this.disconnectedClients.length == 0){
      this.disconnectedPlayerVotes = this.game.has.players
      .filter(player => player.id !== disconnectedClient.id)
      .map(player => {
        return  {
          player: {name: player.name, id: player.id},
          playerVotesToDrop: [{
            disconnectedPlayer: disconnectedClient,
            drop: false
          }]
        }
      })
    }

    //set 
    
    if(this.disconnectedClients.length > 0){
      const disconnectingClientIndex = this.disconnectedPlayerVotes.findIndex(playerVotes => playerVotes.player.id == disconnectedClient.id)
      this.disconnectedPlayerVotes.splice(disconnectingClientIndex, 1)

      this.disconnectedPlayerVotes.forEach(playerVotes => {
        playerVotes.playerVotesToDrop.push({
          disconnectedPlayer: disconnectedClient,
          drop: false
        })
      })
      
    }

    
    this.disconnectedClients.push(disconnectedClient)

    this.game.functions.triggerUIUpdate()
  }

  gameDisplayReconnected(reconnectingDisplay: ConnectedClient){

  }
  
  playerReconnected(reconnectingPlayer: ConnectedClient){
    const player = this.game.has.players.find(player => player.id == reconnectingPlayer.id)

    player.socket = reconnectingPlayer.socket
    const disconnectedPlayerIndex = this.disconnectedClients.findIndex(disconnectedPlayer => disconnectedPlayer.id == reconnectingPlayer.id)
    this.disconnectedClients.splice(disconnectedPlayerIndex, 1)
    

    if(this.disconnectedClients.length == 0){
      this.disconnectedPlayerVotes = []
      this.game.functions.unPause()
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
        playerVotesToDrop: this.disconnectedClients.map(disconnectedPlayer => {
          return {
            disconnectedPlayer,
            drop: false
          }
        })
      })
    }

    this.game.functions.triggerUIUpdate()

  }

  playerVoteToggle(votingPlayer: ClientNameAndID, disconnectedPlayer: ClientNameAndID, vote: boolean){

    const playerVote = this.disconnectedPlayerVotes.find(playerVotes => playerVotes.player.id == votingPlayer.id)

    const disconnectedPlayerVote = playerVote.playerVotesToDrop.find(playerVote => playerVote.disconnectedPlayer.id == disconnectedPlayer.id)

    disconnectedPlayerVote.drop = vote

    this.checkIfAllPlayersDropDisconnectedClient()

    this.game.functions.triggerUIUpdate()
  }


  checkIfAllPlayersDropDisconnectedClient(){
    const disconnectedClientsVotedOut: {
      disconnectedPlayer: ClientNameAndID,
      allVoteToDrop: boolean
    }[] = this.disconnectedPlayerVotes[0].playerVotesToDrop.map(disconnectedPlayerVote => ({disconnectedPlayer: disconnectedPlayerVote.disconnectedPlayer, allVoteToDrop: disconnectedPlayerVote.drop}))

    this.disconnectedPlayerVotes.forEach(playerVote => {
      playerVote.playerVotesToDrop.forEach(playersDisconnectedPlayerVote => {
        
        const voteOutPlayer = disconnectedClientsVotedOut.find(disconnectedClientsVotedOut => disconnectedClientsVotedOut.disconnectedPlayer.id == playersDisconnectedPlayerVote.disconnectedPlayer.id)

        if(voteOutPlayer.allVoteToDrop == true && playersDisconnectedPlayerVote.drop == false){
          voteOutPlayer.allVoteToDrop = false
        }
      })
    })

    disconnectedClientsVotedOut.forEach(disconnectedClientsVotedOut => {
      if(disconnectedClientsVotedOut.allVoteToDrop){
        this.dropDisconnectedPlayer(disconnectedClientsVotedOut.disconnectedPlayer)
      }
    })

  }

  dropDisconnectedPlayer(droppedPlayer: ClientNameAndID){
    removePlayerAndManager()    
    updateDisconnectedPlayersInfo()
    this.game.functions.unPause()
    
    
    
    const classThis = this
    
    function removePlayerAndManager(){
      const droppedPlayerIndex = classThis.game.has.players.findIndex(player => droppedPlayer.id == player.id)
      classThis.game.has.players.splice(droppedPlayerIndex, 1)
    }

    function updateDisconnectedPlayersInfo(){
      classThis.disconnectedClients = classThis.disconnectedClients.filter(disconnectedClient => disconnectedClient.id == droppedPlayer.id)
      classThis.disconnectedPlayerVotes.forEach(disconnectedPlayerVote => {
        disconnectedPlayerVote.playerVotesToDrop = disconnectedPlayerVote.playerVotesToDrop.filter(playerVotesToDrop => playerVotesToDrop.disconnectedPlayer.id == droppedPlayer.id)
      })
    }


  }

 };
  