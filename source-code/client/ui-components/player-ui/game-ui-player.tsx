import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import IUpdateCommunicatorUi from '../../../interfaces/update-communicator-ui.interface';
import { PlayerGameUiData } from '../../../interfaces/game-ui-state.interface';
import ManagerOptionsUi from './manager-options-ui/manager-options-ui';
import FightUi from '../global/main-components/fight-ui/fight-ui';
import { PreFightNews } from '../global/main-components/pre-fight-news/pre-fight-news';
import PlayerFightUi from './player-fight-ui/player-fight-ui';



interface GameUiProps {
  updateCommunicatorUi: IUpdateCommunicatorUi
}

interface GameUiState{
  playerGameUiData: PlayerGameUiData
}

export default hot(class GameUiPlayer extends React.Component<GameUiProps, GameUiState>{
  state: GameUiState = {
    playerGameUiData: undefined
  }

  constructor(props) {
    super(props)
    const {receivePlayerGameUiData} = this.props.updateCommunicatorUi
    
    receivePlayerGameUiData.subscribe(
      (playerGameUiData: PlayerGameUiData) => this.setState({playerGameUiData})
    )
  }


  render() {
    if (!this.state.playerGameUiData)
      return <span>loading....</span>
    const { updateCommunicatorUi } = this.props
    const { playerManagerUiData, fightUiData, roundStage, preFightNewsUiData } = this.state.playerGameUiData

    switch (roundStage) {

      case 'Manager Options':
        return <ManagerOptionsUi {...playerManagerUiData}
          sendGameAction={updateCommunicatorUi.sendGameAction.bind(updateCommunicatorUi)} />

      case 'Pre Fight News':
        return <PreFightNews preFightNewsUiData={preFightNewsUiData}/>

      case 'Fight Day':
        return <PlayerFightUi fightUiData={fightUiData} />

      case 'Post Fight Report':
        return <div>Post Fight Report</div>

      default:
        return <div>no round stage, something went wrong</div>

    }

  }
})