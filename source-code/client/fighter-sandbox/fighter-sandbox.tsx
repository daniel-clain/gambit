
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import Fighter from '../../classes/game/fighter/fighter';
import FightComponent from '../components/Connected/Game/Round/Fight/fight.component';
import LocalMessageService from '../services/local-message.service';
import { Component } from 'react';
import Fight from '../../classes/game/round/fight/fight';
import styled from 'styled-components';

const FighterSandbox = styled.div`
  margin: 0;
  font-family: sans-serif;
`


class FighterSandboxComponent extends Component{
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
      <FighterSandbox>
        <FightComponent messageService={new LocalMessageService(this.fight)}></FightComponent>
      </FighterSandbox>
    )
  }  
}

ReactDOM.render(
  <FighterSandboxComponent/>, document.getElementById('react-rendering-div')
)
