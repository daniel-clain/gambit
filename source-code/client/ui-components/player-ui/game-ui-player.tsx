import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import IUpdateCommunicatorUi from '../../../interfaces/update-communicator-ui.interface';
import { PlayerGameUiData } from '../../../interfaces/game-ui-state.interface';
import ManagerOptionsUi from './manager-options-ui/manager-options-ui';
import FightUi from '../global/main-components/fight-ui/fight-ui';
import { PreFightNews } from '../global/main-components/pre-fight-news/pre-fight-news';
import PlayerFightUi from './player-fight-ui/player-fight-ui';
import { DisconnectedPlayerModal } from '../global/partials/disconnected-player-modal';
import PlayerNameAndId from '../../../interfaces/player-name-and-id';



interface GameUiProps {
  player: PlayerNameAndId
  updateCommunicatorUi: IUpdateCommunicatorUi
}

interface GameUiState{
  playerGameUiData: PlayerGameUiData
}

export default hot(class GameUiPlayer extends React.Component<GameUiProps, GameUiState>{

  clientId: string

  state: GameUiState = {
    playerGameUiData: undefined
  }

  constructor(props) {
    super(props)
    this.clientId = localStorage.getItem('clientid')
    const {receivePlayerGameUiData} = this.props.updateCommunicatorUi
    
    receivePlayerGameUiData.subscribe(
      (playerGameUiData: PlayerGameUiData) => this.setState({playerGameUiData})
    )
  }


  render() {
    if (!this.state.playerGameUiData)
      return <span>loading....</span>
    const { updateCommunicatorUi, player } = this.props
    const { playerManagerUiData, fightUiData, roundStage, preFightNewsUiData, disconnectedPlayerVotes } = this.state.playerGameUiData

    let activeStageView

    switch (roundStage) {

      case 'Manager Options':
        activeStageView = <ManagerOptionsUi {...playerManagerUiData}
          sendGameAction={updateCommunicatorUi.sendGameAction.bind(updateCommunicatorUi)} />
          break;

      case 'Pre Fight News':
        activeStageView = <PreFightNews preFightNewsUiData={preFightNewsUiData}/>
        break;

      case 'Fight Day':
        activeStageView = <PlayerFightUi fightUiData={fightUiData} />
        break;

      case 'Post Fight Report':
        activeStageView = <div>Post Fight Report</div>
        break;

      default:
        activeStageView = <div>no round stage, something went wrong</div>

    }

    return <>
      {disconnectedPlayerVotes.length > 0 ?
        <DisconnectedPlayerModal 
          disconnectedPlayerVotes={disconnectedPlayerVotes}
          updateCommunicatorUi={updateCommunicatorUi}
          player={player}
        /> : ''
      }
      {activeStageView}
    </>

  }
})