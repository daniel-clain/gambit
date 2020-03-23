
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import '../../ui-components/global/styles/global.scss';
import Fighter from '../../../game-components/fighter/fighter';
import Fight from '../../../game-components/fight/fight';
import { shuffle } from '../../../helper-functions/helper-functions';
import { FightUiData } from '../../../interfaces/game/fight-ui-data';
import gameConfiguration from '../../../game-settings/game-configuration';
import FightUi from '../../ui-components/global/main-components/fight-ui/fight-ui';

export default class FighterUiTest extends React.Component{
  state = {
    fightUiData: null 
  }

  componentDidMount(){
    gameConfiguration.stageDurations.maxFightDuration = 10000000
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
    const fighterStrong = new Fighter('Strong')
    const fighterFit = new Fighter('Fit')
    const fighterAverage = new Fighter('Average')
    const fighterStupid = new Fighter('Stupid')
    const fighterPassive = new Fighter('Passive')
    const fighterHyper = new Fighter('Hyper')
    const fighterTough = new Fighter('Tough')
    const fighterSuperman = new Fighter('Superman')

    let fighters = [
      /* fighterDaniel,
      fighterDave ,
      fighterSam, 
      fighterHyper,*/

      fighterBob,
      fighterFred,
      fighterJeff,
      fighterKevin,
      fighterJoe,
      fighterSteve,

      fighterFast, 
      fighterTough, 
      fighterStrong,
      fighterFit,
      fighterIntelligent,
      fighterAggressive,
      fighterAverage,

      /* fighterStupid,
      fighterPassive, */

      //fighterSuperman
    ]
    fighters = shuffle(fighters)
    fighters.forEach(fighter => {      
      fighter.fighting.stats.baseStrength = 2
      fighter.fighting.stats.fitness = 2
      fighter.fighting.stats.baseIntelligence = 2
      fighter.fighting.stats.baseAggression = 2
      fighter.reset()
    })


    fighterFast.fighting.stats.baseSpeed = 10
    fighterTough.fighting.stats.baseStamina = 15

    fighterStrong.fighting.stats.baseStrength = 10
    fighterFit.fighting.stats.fitness = 10
    fighterIntelligent.fighting.stats.baseIntelligence = 10
    fighterAggressive.fighting.stats.baseAggression = 10

    fighterAverage
    
    fighterAverage.fighting.stats.baseStrength = 5
    fighterAverage.fighting.stats.fitness = 5
    fighterAverage.fighting.stats.baseIntelligence = 5
    fighterAverage.fighting.stats.baseAggression = 5

    fighterStupid.fighting.stats.baseIntelligence = 0
    fighterPassive.fighting.stats.baseAggression = 0

    fighterHyper.fighting.stats.baseAggression = 10
    fighterHyper.fighting.stats.fitness = 10
    
    fighterPassive.fighting.stats.baseAggression = 1
    fighterPassive.fighting.stats.baseIntelligence = 1
    fighterPassive.fighting.stats.baseStrength = 1

    fighterDaniel.fighting.stats.baseStrength = 8
    fighterDaniel.fighting.stats.fitness = 8
    fighterDaniel.fighting.stats.baseIntelligence = 10
    fighterDaniel.fighting.stats.baseAggression = 3

    
    fighterDave.fighting.stats.baseAggression = 8
    fighterDave.fighting.stats.baseStrength = 10
    fighterDave.fighting.stats.baseIntelligence = 1
    fighterDave.fighting.stats.fitness = 1

    
    fighterSam.fighting.stats.baseStrength = 4
    fighterSam.fighting.stats.fitness = 8
    fighterSam.fighting.stats.baseIntelligence = 8
    fighterSam.fighting.stats.baseAggression = 4
    
    
    fighterSuperman.fighting.stats.baseStrength = 10
    fighterSuperman.fighting.stats.fitness = 10
    fighterSuperman.fighting.stats.baseIntelligence = 10
    fighterSuperman.fighting.stats.baseAggression = 10



    const fight = new Fight(fighters, undefined)
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


const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
ReactDOM.render(<FighterUiTest/>, reactRenderingTag)