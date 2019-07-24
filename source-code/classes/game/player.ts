import {Subject} from 'rxjs';
import {GameState, FightEventState, ManagerOptionsState, GameStateGeneral} from './../../interfaces/client-ui-state.interface';
import ClientId from '../../types/client-id.type';
import ClientName from '../../types/client-name.type';
import Game from './game';

export default class Player{

  gameUiStateSubject: Subject<GameState> = new Subject()
  
  private gameUiState: GameState = {
    players: [],
    gameChat: [],
    fightActive: false,
    fightEvent: null,
    managerOptions: null,
    timeTillNextFight: null
  }
  
  constructor(private _id: ClientId, private _name: ClientName, private game: Game){
    this.sendGameUIStateToClient()
  }


  get id(){
    return this._id
  }
  get name(){
    return this._name
  }

  gameGeneralUiUpdate(gameStateGeneral: GameStateGeneral){ 
    this.gameUiState.players = gameStateGeneral.players
    this.gameUiState.gameChat = gameStateGeneral.gameChat
    this.gameUiState.fightActive = gameStateGeneral.fightActive
    this.gameUiState.timeTillNextFight = gameStateGeneral.timeTillNextFight

    this.sendGameUIStateToClient()
  }

  fightUiUpdate(fightEventState: FightEventState){ 
    this.gameUiState.fightEvent = fightEventState
    this.sendGameUIStateToClient()
  }

  managerUiUpdate(managerOptionsState: ManagerOptionsState){ 
    this.gameUiState.managerOptions = managerOptionsState
    this.sendGameUIStateToClient()
  }

  private sendGameUIStateToClient(){
    this.gameUiStateSubject.next(this.gameUiState)
  }
}
