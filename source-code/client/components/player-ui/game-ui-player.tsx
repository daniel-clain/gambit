import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import IUpdateCommunicatorUi from '../../../interfaces/update-communicator-ui.interface';
import { PlayerGameUiData } from '../../../interfaces/game-ui-state.interface';
import FightUi from '../fight-ui/fight-ui';
import ManagerOptionsUi from './manager-options-ui/manager-options-ui';



interface GameUiProps {
  updateCommunicatorUi: IUpdateCommunicatorUi
}

interface GameUiState{
  playerGameUiData: PlayerGameUiData
}

export default hot(class GameUiPlayer extends React.Component<GameUiProps, GameUiState>{
  state = {
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
    const { playerManagerUiData, fightUiData, roundStage } = this.state.playerGameUiData

    switch (roundStage) {

      case 'Manager Options':
        return <ManagerOptionsUi {...playerManagerUiData}
          sendPlayerAction={updateCommunicatorUi.sendPlayerAction.bind(updateCommunicatorUi)} />

      case 'Pre Fight News':
        return <div>Pre Fight News</div>

      case 'Fight Day':
        return <FightUi fightUiData={fightUiData} />

      case 'Post Fight Report':
        return <div>Post Fight Report</div>

      default:
        return <div>no round stage, something went wrong</div>

    }

  }
})