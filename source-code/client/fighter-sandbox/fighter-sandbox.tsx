
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Fighter } from '../../classes/game/fighter/fighter';
import FightComponent from '../components/Connected/Game/Round/Fight/fight.component';
import LocalMessageService from '../services/local-message.service';
import { Component } from 'react';
import Test from './test';
import Fight from '../../classes/game/round/fight/fight';

class FighterSandbox extends Component{
  fight: Fight
  fighters: Fighter[]
  constructor(props){
    super(props)
    this.fighters = [
      new Fighter('Dave'),
      new Fighter('Fred')
    ]
    this.fight = new Fight(this.fighters)
    this.fight.start()
  }  
  
  render(){
    return (
      <div>
        penis
        <FightComponent messageService={new LocalMessageService(this.fight)}></FightComponent>
        <Test></Test>
      </div>
    )
  }  
}

ReactDOM.render(
  <FighterSandbox/>, document.getElementById('react-rendering-div')
)

//<FightComponent messageService={new LocalMessageService(this.fight)}></FightComponent>