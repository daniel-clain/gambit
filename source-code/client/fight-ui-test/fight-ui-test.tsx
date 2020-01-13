
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

    fighterDaniel.fighting.stats.strength = 4
    fighterDaniel.fighting.stats.speed = 4
    fighterDaniel.fighting.stats.intelligence = 5
    fighterDaniel.fighting.stats.aggression = 3
    fighterDaniel.fighting.stats.maxSpirit = 5
    fighterDaniel.fighting.stats.maxStamina = 4

    
    fighterDave.fighting.stats.maxStamina = 5
    fighterDave.fighting.stats.maxSpirit = 2
    fighterDave.fighting.stats.aggression = 2
    fighterDave.fighting.stats.intelligence = 1
    fighterDave.fighting.stats.speed = 1
    fighterDave.fighting.stats.strength = 5

    
    fighterSam.fighting.stats.strength = 2
    fighterSam.fighting.stats.speed = 5
    fighterSam.fighting.stats.intelligence = 5
    fighterSam.fighting.stats.aggression = 4
    fighterSam.fighting.stats.maxSpirit = 5
    fighterSam.fighting.stats.maxStamina = 3


    const fight = new Fight([
      fighterDaniel,
      fighterBob,
      fighterFred,
      fighterSam,
      fighterDave ,
      fighterJeff,
      fighterKevin,
      fighterJoe,
      fighterSteve /**/
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