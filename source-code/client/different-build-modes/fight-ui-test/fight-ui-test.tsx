
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import FightUi from '../../components/fight-ui/fight-ui';
import '../main-game/global.scss'
import Fighter from '../../../game-components/fighter/fighter';
import Fight from '../../../game-components/fight/fight';
import { shuffle } from '../../../helper-functions/helper-functions';
import { FightUiData } from '../../../interfaces/game/fight-ui-data';

export default class FighterUiTest extends React.Component{
  state = {
    fightUiData: null 
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
    const fighterFast = new Fighter('Fast')
    const fighterIntelligent = new Fighter('Intelligent')
    const fighterAggressive = new Fighter('Aggressive')
    const fighterStupid = new Fighter('Stupid')
    const fighterPassive = new Fighter('Passive')
    const fighterTest = new Fighter('Test')

    let fighters = [
      /* fighterDaniel,
      fighterDave ,
      fighterSam, */
      /* fighterBob,
      fighterFred,
      fighterJeff,
      fighterKevin,
      fighterJoe,
      fighterSteve,
      fighterFast, */
      fighterIntelligent,
      //fighterAggressive,
      fighterStupid,
      fighterPassive,
      fighterTest
    ]
    fighters = shuffle(fighters)
    fighters.forEach(fighter => {      
      fighter.fighting.stats.baseStrength = 3
      fighter.fighting.stats.fitness = 3
      fighter.fighting.stats.baseIntelligence = 3
      fighter.fighting.stats.baseAggression = 3
      fighter.reset()
    })


    fighterFast.fighting.stats.baseSpeed = 10
    fighterIntelligent.fighting.stats.baseIntelligence = 10
    fighterAggressive.fighting.stats.baseAggression = 10
    fighterStupid.fighting.stats.baseIntelligence = 0
    fighterPassive.fighting.stats.baseAggression = 1

    fighterTest.fighting.stats.baseAggression = 10
    fighterTest.fighting.stats.baseSpeed = 10
    fighterPassive.fighting.stats.baseAggression = 1
    fighterPassive.fighting.stats.baseStrength = 1

    fighterDaniel.fighting.stats.baseStrength = 8
    fighterDaniel.fighting.stats.fitness = 8
    fighterDaniel.fighting.stats.baseIntelligence = 10
    fighterDaniel.fighting.stats.baseAggression = 3

    
    fighterDave.fighting.stats.baseAggression = 8
    fighterDave.fighting.stats.baseStrength = 8
    fighterDave.fighting.stats.baseIntelligence = 1
    fighterDave.fighting.stats.fitness = 8

    
    fighterSam.fighting.stats.baseAggression = 6
    fighterSam.fighting.stats.fitness = 6
    fighterSam.fighting.stats.baseIntelligence = 6
    fighterSam.fighting.stats.baseAggression = 6


    const fight = new Fight(fighters)
    fight.fightUiDataSubject.subscribe((fightUiData: FightUiData) => {
      this.setState({fightUiData})
    })

    fight.start()
  }

  render(){
    const {fightUiData} = this.state
    if(fightUiData)
      return <FightUi fightUiData={fightUiData}/>
    else
      return <div>loading....</div>
  }
}


ReactDOM.render(<FighterUiTest/>, document.getElementById('react-rendering-div'))