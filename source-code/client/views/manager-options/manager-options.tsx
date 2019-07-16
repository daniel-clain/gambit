import * as React from 'react';
import styled from 'styled-components';
import UIView, { UIViewProps } from '../view';

interface UIFighterInFight{
  name
  previousFights: []
  stats: IFighterAttribute[]
  events: []
  traits: []
}

interface UIYourFighters{
  name
  previousFights: []
  stats: IFighterAttribute[]
  events: []
  traits: []
}

interface UIManagerOptions{
  name: ManagerOptionNames
}


export interface ManagerOptionsProps extends UIViewProps {
  money: number
  actionPoints: number

}

const stylesComponents = {
  ManagerOptionsContainer_s: styled.div`
    .head-bar{      
      padding: 1rem;
      background-color: #007e82;
      color: white;
      span {
        margin-right: 2rem;
      }
    }
    .scene-divisions{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .top, .bottom {
        display: flex;
        width: 100%;
        .left, .right {    
          background: #85dfe2;
          padding: 2rem;
          flex-basis: 50%;
          margin: .5rem;
        }
      }
    }
  `,
  Money_s: styled.span`
    margin: auto;
  `,
  ActionPoints_s: styled.span`
    margin: auto;
  `,
  Phone_s: styled.span`
    margin: auto;
  `,
  TimeUntilFight_s: styled.span`
    align-self: flex-end;
  `,
  ManagerOptions_s: styled.div`
  `,
  ManagerOption_s: styled.div`
  `,
  FightersInTheFight_s: styled.div`
  `,
  FighterPanel_s: styled.div`
  `,
  YourFighters_s: styled.div`
  `,
  ManagerLog_s: styled.div`
  `,
  FighterStatsModal_s: styled.div`
  `,
}

type ManagerOptionsState = {
  modalfighterInfo: UIFighterInFight | UIYourFighters
}
export default class C_ManagerOptions extends React.Component<ManagerOptionsProps> {
  state: ManagerOptionsState = {
    modalfighterInfo: null
  }
  public render() {    
    const {money, actionPoints, fightersInTheNextFight, options, yourFighters, timeUntilFight} = this.props
    const {modalfighterInfo} = this.state
    const {ManagerOptionsContainer_s, ManagerOptions_s, Money_s, ActionPoints_s, Phone_s, ManagerOption_s, FightersInTheFight_s, FighterPanel_s, YourFighters_s, ManagerLog_s, FighterStatsModal_s, TimeUntilFight_s} = stylesComponents
    return (
      <ManagerOptionsContainer_s>
        <div className='head-bar'>
          <Money_s>Money: {money}</Money_s>
          <ActionPoints_s>Action Points: {actionPoints}</ActionPoints_s>
          <Phone_s></Phone_s>
          <TimeUntilFight_s>Time Until Fight: {timeUntilFight}</TimeUntilFight_s>
        </div>
        <div className='scene-divisions'>
          <div className='top'>
            <div className='left'>
              <ManagerOptions_s>
                <h3>Manager Options</h3>
                {options.map(option => (
                  <ManagerOption_s key={option.name}>
                    {option.name}
                  </ManagerOption_s>
                ))}
              </ManagerOptions_s>
            </div>          
            <div className='right'>
              <FightersInTheFight_s>
                <h3>Fighters In The Fight</h3>
                {fightersInTheNextFight.map(fighter => (
                  <FighterPanel_s onClick={() => this.setState({fighterInfoModalData: fighter})}  key={fighter.name}>
                    {fighter.name}
                  </FighterPanel_s>
                ))}
              </FightersInTheFight_s>
            </div>
          </div>
          <div className='bottom'>
            <div className='left'>
              <YourFighters_s>
                <h3>Your Fighters</h3>
                  {yourFighters.map(fighter => (
                    <FighterPanel_s onClick={() => this.setState({fighterInfoModalData: fighter})} key={fighter.name}>
                      {fighter.name}
                    </FighterPanel_s>
                  ))}
              </YourFighters_s>
            </div>
            <div className='right'>
              <ManagerLog_s>
                <h2>Manager Log</h2>
              </ManagerLog_s>
            </div>
          </div>
        </div>
        {modalfighterInfo && 
          <FighterStatsModal_s>
            Name: {modalfighterInfo.name}<br/>
            Stats: {modalfighterInfo.stats.map(stat => <div key={stat.name}>{stat.name}: {stat.value}</div>)}
          </FighterStatsModal_s>
        }
      </ManagerOptionsContainer_s>
    )
  }
}
