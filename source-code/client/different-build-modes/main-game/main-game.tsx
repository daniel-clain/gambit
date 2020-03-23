
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import '../../ui-components/global/styles/global.scss';
import { MainGameData } from '../../../interfaces/game-ui-state.interface';
import UpdateCommunicatorUiWebsocket from '../../update-communicator-ui-websocket';
import ClientAction from '../../../interfaces/client-action';
import GameUiPlayer from '../../ui-components/player-ui/game-ui-player';
import GameUiDisplay from '../../ui-components/display-ui/game-ui-display'
import GameHost from '../../ui-components/global/main-components/pre-game/game-host';
import PreGame from '../../ui-components/global/main-components/pre-game/pre-game';

interface MainGameState{
  isGameDisplay: boolean
  mainGameData: MainGameData
}

export default class MainGame extends React.Component<{updateCommunicatorUi: UpdateCommunicatorUiWebsocket}>
{
  state: MainGameState = {
    isGameDisplay: false,
    mainGameData: undefined
  }
  
  constructor(props){
    super(props)

    this.props.updateCommunicatorUi.receiveMainGameData.subscribe(
      (mainGameData: MainGameData) => this.setState({mainGameData}))

    this.tryToConnectToGameHost()

  }
  

  tryToConnectToGameHost(isGameDisplay?: boolean){
    let name = localStorage.getItem('name')
    if(!name && !isGameDisplay)
      return

    if(isGameDisplay){
      name = 'Game Display'  
      this.setState({isGameDisplay})
    }

    let clientId = localStorage.getItem('clientId')
    if(clientId == null){
      clientId = new Date().getTime().toString()
      localStorage.setItem('clientId', clientId)
    }
    const connectAction: ClientAction = {      
      name: 'Connect To Game Host',
      data: {name, id: clientId}    
    }    
    this.props.updateCommunicatorUi.sendClientAction(connectAction)
  }
  render(){
    if(this.state.mainGameData == undefined)
      return <PreGame tryToConnectToGameHost={this.tryToConnectToGameHost.bind(this)}/>


    const {inGame} = this.state.mainGameData
    if(inGame){
      return this.state.isGameDisplay ?
      <GameUiDisplay updateCommunicatorUi={this.props.updateCommunicatorUi} /> :
      <GameUiPlayer updateCommunicatorUi={this.props.updateCommunicatorUi}/> 
    }
    
    if(inGame == false)
      return <GameHost 
        mainGameData={this.state.mainGameData}
        sendClientAction={this.props.updateCommunicatorUi.sendClientAction.bind(this.props.updateCommunicatorUi)}/>
    
  }
}

const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
ReactDOM.render(<MainGame updateCommunicatorUi={new UpdateCommunicatorUiWebsocket()}/>, reactRenderingTag)
//ReactDOM.render(<div>test</div>, reactRenderingTag)

