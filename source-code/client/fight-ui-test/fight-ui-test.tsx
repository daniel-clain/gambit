
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import FightUi from '../components/fight-ui/fight-ui';
import Fight, { FightState } from '../../classes/game/fight/fight';
import Fighter from '../../classes/game/fighter/fighter';
import './../main-game/global.scss'

export default class FighterUiTest extends React.Component{
  state = {
    fightState: null 
  }

  componentDidMount(){
    const fighterBob = new Fighter('Bob')
    const fighterFred = new Fighter('Fred')

    const fight = new Fight([fighterBob, fighterFred])
    fight.fightStateUpdatedSubject.subscribe((fightState: FightState) => {
      console.log('fightState :', fightState);
      this.setState({fightState})
    })

    fight.start()
  }

  render(){
    const {fightState} = this.state
    if(!fightState)
      return 'balls'
    return <FightUi fightState={fightState}/>
  }
}


ReactDOM.render(<FighterUiTest/>, document.getElementById('react-rendering-div'))