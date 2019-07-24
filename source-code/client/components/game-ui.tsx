
import * as React from 'react';
import C_FightUI from "./fight-ui";
import C_ManagerUI from "./manager-ui";
import { GameState } from '../../interfaces/client-ui-state.interface';



export default class C_GameUI extends React.Component<GameState>{

  render(){

    /* players: [
      {
        name: null,
        id: null
      }
    ],
    gameChat: [],
    fightActive: false,
    timeTillNextFight: null,
    fightEvent: FightEventState,
    managerOptions: ManagerOptionsState */
    const {fightActive, fightEvent, managerOptions, timeTillNextFight} = this.props
    if(fightActive)
      return <C_FightUI {...fightEvent}/>
    else
      return <C_ManagerUI managerOptions={managerOptions} timeTillNextFight={timeTillNextFight}/>
  }

}