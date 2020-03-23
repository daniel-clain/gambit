
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import '../../ui-components/global/styles/global.scss'
import Game from '../../../game-components/game';
import IUpdateCommunicatorUi from '../../../interfaces/update-communicator-ui.interface';
import UpdateCommunicatorUiLocal from './update-communicator-ui-local';
import GameUiPlayer from '../../ui-components/player-ui/game-ui-player';
import { Employee } from '../../../interfaces/game-ui-state.interface';



export default class SinglePlayerTest extends React.Component{
  private game: Game
  private updateCommunicatorUiLocal: IUpdateCommunicatorUi
  constructor(props){
    super(props)
    this.game = new Game('Local', [{name: 'local player', socket: null, id: null}])

    const gertrudeHitman: Employee = {
      name: 'Gertrude',
      actionPoints: 1,
      activeContract: {weeklyCost: 1, weeksRemaining: 20, numberOfWeeks: 20},
      skillLevel: 1,
      profession: 'Hitman',
      abilities: ['Murder Fighter', 'Poison Fighter']
    }

    
    const thug1: Employee = {
      name: 'thug1',
      actionPoints: 1,
      activeContract: {weeklyCost: 1, weeksRemaining: 20, numberOfWeeks: 20},
      skillLevel: 1,
      profession: 'Thug',
      abilities: ['Assault Fighter', 'Guard Fighter']
    }
    const thug2: Employee = {
      name: 'thug2',
      actionPoints: 1,
      activeContract: {weeklyCost: 1, weeksRemaining: 20, numberOfWeeks: 20},
      skillLevel: 1,
      profession: 'Thug',
      abilities: ['Assault Fighter', 'Guard Fighter']
    }

    
    const drugDealer: Employee = {
      name: 'drugDealer',
      actionPoints: 1,
      activeContract: {weeklyCost: 1, weeksRemaining: 20, numberOfWeeks: 20},
      skillLevel: 1,
      profession: 'Drug Dealer',
      abilities: ['Sell Drugs']
    }
    const privateAgent: Employee = {
      name: 'privateAgent',
      actionPoints: 1,
      activeContract: {weeklyCost: 1, weeksRemaining: 20, numberOfWeeks: 20},
      skillLevel: 1,
      profession: 'Private Agent',
      abilities: ['Poison Fighter']
    }
    const trainer: Employee = {
      name: 'trainer',
      actionPoints: 1,
      activeContract: {weeklyCost: 1, weeksRemaining: 20, numberOfWeeks: 20},
      skillLevel: 3,
      profession: 'Trainer',
      abilities: ['Train Fighter']
    }


    this.game.managers[0].employees.push(gertrudeHitman, thug1, thug2, drugDealer, privateAgent, trainer)
    this.game.managers[0].money = 50000
    this.updateCommunicatorUiLocal = new UpdateCommunicatorUiLocal(this.game.playersUpdateCommunicators[0])
  }

  render(){    
    return <GameUiPlayer updateCommunicatorUi={this.updateCommunicatorUiLocal}/>
  }
}
const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
ReactDOM.render(<SinglePlayerTest/>, reactRenderingTag)

