
import * as React from 'react';

import './fighter-card.scss';
import './modal-cards.scss';
import { FighterInfo } from '../../../interfaces/game-ui-state.interface';
import { ManagerInfo } from '../../../game-components/manager/manager';
import { Bet } from '../../../interfaces/game/bet';
import { AbilityData } from '../../../interfaces/game/client-ability.interface';
import AbilityService from './ability-service';
import gameConfiguration from '../../../game-components/game-configuration';
import AbilityBlock from './ability-block';


interface FighterCardProps{
  fighterInfo: FighterInfo
  managerInfo: ManagerInfo
  placeBet(bet: Bet)
  onAbilityBlockSelected(optionData: AbilityData)
  abilityService: AbilityService
}

export class FighterCard extends React.Component<FighterCardProps>{

  render(){
    const {placeBet, fighterInfo, onAbilityBlockSelected, managerInfo, abilityService} = this.props
      let {name, isPlayersFighter, inNextFight, strength, speed, intelligence, aggression, manager, publicityRating, numberOfFights, numberOfWins, injured, healthRating, doping, happyness} = fighterInfo
      
    const {betSizePercentages} = gameConfiguration

    const smallBetAmount = Math.round(managerInfo.money * (betSizePercentages.small/100))
    const mediumBetAmount = Math.round(managerInfo.money * (betSizePercentages.medium/100))
    const largeBetAmount = Math.round(managerInfo.money * (betSizePercentages.large/100))

    const abilitiesFighterCanBeTheTargetOf: AbilityData[] = abilityService.getAbilitiesFighterCanBeTheTargetOf(fighterInfo, managerInfo)


    return (
      <div className='card fighter-card'>
        <div className='card__name'>{name}</div>

        <div className='fighter-card__image card__left'></div>

        <div className='card__right'>
          <div className='fighter-card__fight-experience'>
            <span className='fights'>
              <span className='icon'>Fights</span>{numberOfFights}
            </span>
            <span className='wins'>
              <span className='icon'>Wins</span>{numberOfWins}
            </span>
          </div>
          {inNextFight &&
            <div className='fighter-card__bet-options'>
              <div className='small-bet bet-option'>
                <div>Small Bet</div>
                <div className='bet-info'>({betSizePercentages.small}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{smallBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet({size: 'small', fighterName: name})}>Place Bet</button>
              </div>

              <div className='medium-bet bet-option'>
                <div>Medium Bet</div>
                <div className='bet-info'>({betSizePercentages.medium}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{mediumBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet({size: 'medium', fighterName: name})}>Place Bet</button>
              </div>

              <div className='large-bet bet-option'>
                <div>Large Bet</div>
                <div className='bet-info'>({betSizePercentages.large}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{largeBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet({size: 'large', fighterName: name})}>Place Bet</button>
              </div>
            </div>
          }

          <div className='fighter-card__stats'>
            <div className='heading'>{isPlayersFighter && <span>Known </span>}Stats</div>
            <div className='basic-stats stats__group'>
              <div className='stats__heading'>Public Stats</div>
              <div className='stat'><label>Publicity Rating: </label>{publicityRating}</div>
              <div className='stat'><label>Health: </label>{healthRating}</div>
              <div className='stat'><label>Injured: </label>{injured ? 'yes':'no'}</div>
              <div className='stat'><label>Manager: </label>{manager}</div>
            </div>

            <div className='private-stats stats__group'>
              <div className='stats__heading'>Private Stats</div>
              <div className='stat'><label>Strength: </label>{strength}</div>
              <div className='stat'><label>Speed: </label>{speed}</div>
              <div className='stat'><label>Intelligence: </label>{intelligence}</div>
              <div className='stat'><label>Aggression: </label>{aggression}</div>
              <div className='stat'><label>Doping: </label>{doping ? 'yes':'no'}</div>
              <div className='stat'><label>Happiness: </label>{happyness}</div>
            </div>
          </div>
        </div>

        <div className='card__options'>
          <div className='heading'>Options x</div>
          {abilitiesFighterCanBeTheTargetOf.map(
            (abilityData: AbilityData) => (
              <AbilityBlock 
                key={abilityData.name} 
                abilityData={abilityData} 
                onSelected={onAbilityBlockSelected}
                abilityService={abilityService}
              />
            )
          )}
        </div>

      </div>
    )
  }
}

