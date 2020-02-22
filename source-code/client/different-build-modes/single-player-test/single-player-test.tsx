
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import '../../global.scss'
import Game from '../../../game-components/game';
import IUpdateCommunicatorUi from '../../../interfaces/update-communicator-ui.interface';
import UpdateCommunicatorUiLocal from './update-communicator-ui-local';
import GameUiPlayer from '../../components/player-ui/game-ui-player';



export default class SinglePlayerTest extends React.Component{
  private game: Game
  private updateCommunicatorUiLocal: IUpdateCommunicatorUi
  constructor(props){
    super(props)
    this.game = new Game('Local', [{name: 'local player', socket: null, id: null}])
    this.updateCommunicatorUiLocal = new UpdateCommunicatorUiLocal(this.game.playersUpdateCommunicators[0])
  }

  render(){    
    return <GameUiPlayer updateCommunicatorUi={this.updateCommunicatorUiLocal}/>
  }
}
const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
ReactDOM.render(<SinglePlayerTest/>, reactRenderingTag)

