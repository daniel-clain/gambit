import {ClientId} from './../types/game/clientId';
import {Subject} from 'rxjs';
import {Socket} from 'socket.io';
class Player{
  name
  manager: Manager
  uiState

  constructor(gameActionFromClient, gameUiFacade){
    gameActionFromClient.subscribe(this.handleGameActionFromClient)
  }


  assignManager(manager: Manager){
    this.manager = manager
    this.manager.uiUpdate.subscribe(managerUi => this.uiState.)
  }

  private handleGameActionFromClient(action){
    switch(action.name){

    }
  }
}


