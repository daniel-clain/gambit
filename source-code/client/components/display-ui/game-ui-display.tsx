import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import FightUi from '../fight-ui/fight-ui';
import IUpdateCommunicatorUi from '../../../interfaces/update-communicator-ui.interface';
import {  DisplayGameUiData } from '../../../interfaces/game-ui-state.interface';
import DisplayManagerOptions from './display-manager-options-ui/display-manager-options-ui';
import DisplayFightUi from './display-fight-ui/display-fight-ui';


interface GameUiDisplayProps {
  updateCommunicatorUi: IUpdateCommunicatorUi
}

interface GameUiDisplayState{
  displayGameUiData: DisplayGameUiData
}


export default hot(class GameUiDisplay extends React.Component<GameUiDisplayProps, GameUiDisplayState>{


  constructor(props) {
    super(props)
    const {receiveDisplayGameUiData} = this.props.updateCommunicatorUi
    
    receiveDisplayGameUiData.subscribe(
      (displayGameUiData: DisplayGameUiData) => this.setState({displayGameUiData})
    )
  }

  render() {
    if (!this.state)
      return <span>loading....</span>
    const { updateCommunicatorUi } = this.props
    const { fightUiData, displayManagerUiData, roundStage, preFightNewsUiData } = this.state.displayGameUiData

    switch (roundStage) {

      case 'Manager Options':      
        return <DisplayManagerOptions {...displayManagerUiData} />
        

      case 'Pre Fight News':
        return <div>Pre Fight News</div>

      case 'Fight Day':
        return <DisplayFightUi fightUiData={fightUiData} managers={displayManagerUiData.managersDisplayInfo} />

      case 'Post Fight Report':
        return <div>Post Fight Report</div>

      default:
        return <div>no round stage, something went wrong</div>

    }

  }
})