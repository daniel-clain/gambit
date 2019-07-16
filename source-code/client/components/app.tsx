import ClientWebsocketService from '../services/client-websocket.service';
import NotConnected from './NotConnected/not-connected';
import Connected from './Connected/connected';
import Player from '../../interfaces/player';
import ClientService from '../services/client.service';
import * as React from 'react'
import ConnectionStates from '../../types/connection-states';
import StyledApp from './styled/app'
import Header from './Header/header';
import { Subject } from 'rxjs';


interface PreGameState{}

type UIViewName = 'Pre Game' | 'Game'

interface AppUIView{
  name: UIViewName
  subState: any
}
class PreGameView implements AppUIView{
  name: UIViewName = 'Pre Game'
  subState: PreGameState;
}
class GameView implements AppUIView{
  name: UIViewName = 'Game'
  subState: any;
}


interface AppUIState{
  activeView: AppUIView
}


interface AppUIProps{
  appStateUpdates: Subject<AppUIState>
}

export default class App extends React.Component<AppUIProps>{
  appUIState
  constructor(props){
    super(props)    
    props.appStateUpdates.subscribe(updatedAppUIState => this.appUIState = updatedAppUIState)
    
  }

  render(){
    const {activeView} = this.appUIState
    return () => {
      switch(activeView.name){
        case 'Pre Game' : return <pre-game {...activeView.subState}></pre-game>; break;
        case 'Game' : return <game {...activeView.subState}></game>; break
      }
    }
  }
  
}