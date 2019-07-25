
import * as React from 'react';
import { ManagerUiState, FighterInfo } from '../../interfaces/client-ui-state.interface';

export interface ManagerUIProps{
  managerUiState: ManagerUiState
}

export default class C_ManagerUI extends React.Component<ManagerUIProps>{
  constructor(props){
    super(props)
  }
  render(){
    const {timeUntilNextFight, money, actionPoints, clientFighters, fightersInNextFight, actionLog} = this.props.managerUiState

    return (
      <div id='manager-options'>
        <div id='x'>
          Time untill next fight: {timeUntilNextFight}
        </div>

        <div id='money'>
          Money: {money}
        </div>

        <div id='action-points'>
          Action points: {actionPoints}
        </div>

        <div id='client-fighters'>
          Client fighters: {clientFighters.map((fighterInfo: FighterInfo) =>
            <div>
              <div>Name: {fighterInfo.name}</div>
              <div>Number of fights: {fighterInfo.numberOfFights}</div>
              <div>Number of wins: {fighterInfo.numberOfWins}</div>
              <div>Speed: {fighterInfo.speed}</div>
              <div>Strength: {fighterInfo.strength}</div>
            </div>
          )}
        </div>

        <div id='fighters-in-next-fight'>
          Fighters in next fight: {fightersInNextFight.map((fighterInfo: FighterInfo) =>
            <div>
              <div>Name: {fighterInfo.name}</div>
              <div>Number of fights: {fighterInfo.numberOfFights}</div>
              <div>Number of wins: {fighterInfo.numberOfWins}</div>
              <div>Speed: {fighterInfo.speed}</div>
              <div>Strength: {fighterInfo.strength}</div>
            </div>
          )}
        </div>

        <div id='action-log'>
          Action log: {actionLog.map((logEntry: string) =>
            <div>{logEntry}</div>
          )}
        </div>

      </div>
    )
  }
}