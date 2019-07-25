import {Subject} from 'rxjs';
import {GameUiState, FightUiState, ManagerUiState} from './../../interfaces/client-ui-state.interface';
import ClientId from '../../types/client-id.type';
import ClientName from '../../types/client-name.type';
import Game from './game';

export default class Player{

  gameUiStateUpdateSubject: Subject<GameUiState> = new Subject()
  
  private gameUiState: GameUiState = {
    fightUiState: null,
    managerUiState: null,
  }
  
  constructor(private _id: ClientId, private _name: ClientName, private game: Game){
    this.emitGameUIStateUpdate()
  }


  get id(){
    return this._id
  }
  get name(){
    return this._name
  }

  fightUiUpdate(fightEventState: FightUiState){ 
    this.gameUiState.fightUiState = fightEventState
    this.emitGameUIStateUpdate()
  }

  managerUiUpdate(managerOptionsState: ManagerUiState){ 
    this.gameUiState.managerUiState = managerOptionsState
    this.emitGameUIStateUpdate()
  }

  private emitGameUIStateUpdate(){
    this.gameUiStateUpdateSubject.next(this.gameUiState)
  }
}
