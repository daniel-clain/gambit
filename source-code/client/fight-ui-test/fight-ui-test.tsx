
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import FightUi from '../components/fight-ui/fight-ui';
import './../main-game/global.scss'
import Fighter from '../../game-components/fighter/fighter';
import Fight, { FightState } from '../../game-components/fight/fight';

export default class FighterUiTest extends React.Component{
  state = {
    fightState: null 
  }

  componentDidMount(){
    const fighterDaniel = new Fighter('Daniel')
    const fighterBob = new Fighter('Bob')
    const fighterFred = new Fighter('Fred')
    const fighterSam = new Fighter('Sam')
    const fighterJeff = new Fighter('Jeff')
    const fighterKevin = new Fighter('Kevin')
    const fighterJoe = new Fighter('Joe')
    const fighterSteve = new Fighter('Steve')
    const fighterDave = new Fighter('Dave')

    fighterDaniel.state.strength = 3
    fighterDaniel.state.speed = 3
    fighterDaniel.state.intelligence = 3
    fighterDaniel.state.aggression = 3


    fighterBob.state.speed = 2
    fighterFred.state.speed = 2
    fighterSam.state.speed = 2
    fighterJeff.state.speed = 2
    fighterKevin.state.speed = 2
    fighterJoe.state.speed = 2
    fighterSteve.state.speed = 2
    fighterDave.state.speed = 2

    const fight = new Fight([
      fighterDaniel,
      fighterBob,
      fighterFred,
      fighterSam,
      fighterJeff,
      fighterKevin,
      fighterJoe,
      fighterSteve,
      fighterDave
    ])
    fight.fightStateUpdatedSubject.subscribe((fightState: FightState) => {
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