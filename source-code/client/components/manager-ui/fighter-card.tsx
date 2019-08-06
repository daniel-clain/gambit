
import * as React from 'react';
import { FighterInfo, Employee } from '../../../interfaces/game-ui-state.interface';
import gameConfiguration from '../../../classes/game/game-configuration';
import { Bet } from '../../../interfaces/game/bet';
import OptionsProcessor, { IOptionClient, OptionSource, optionValidators, OptionValidator } from '../../../classes/game/manager/manager-options/manager-option';
import OptionBlock from './option-block';
import { OptionData } from './option-card';



interface FighterCardProps{
  fighterInfo: FighterInfo
  money: number
  managerInfo: string
  employees: Employee[]
  placeBet(bet: Bet)
  onOptionBlockSelected(optionData: OptionData)

}

export class FighterCard extends React.Component<FighterCardProps>{

  render(){
    const {money, placeBet, fighterInfo, onOptionBlockSelected, managerName} = this.props
      let {name, inNextFight, isPlayersFighter, strength, speed, intelligence, aggression, manager, publicityRating, endurance, numberOfFights, numberOfWins, injured, healthRating, doping, happyness} = fighterInfo
      
    const {betSizePercentages} = gameConfiguration

    const smallBetAmount = Math.round(money * (betSizePercentages.small/100))
    const mediumBetAmount = Math.round(money * (betSizePercentages.medium/100))
    const largeBetAmount = Math.round(money * (betSizePercentages.large/100))

    const optionsFighterCanBeTheTargetOf: OptionData[] = optionValidators.map(
      (optionValidator: OptionValidator) => {
        if(optionValidator.isValidTarget(fighterInfo)){
          const optionData: OptionData = {
            name: optionValidator.optionName,
            source: null,
            target: {
              name: fighterInfo.name,
              type: 'Fighter'
            }
          }
          return optionData
        }          
      })

    determineDataItemPrioritySource(optionsFighterCanBeTheTargetOf){

    }


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
                  onClick={() => placeBet({amount: smallBetAmount, fighterName: name})}>Place Bet</button>
              </div>

              <div className='medium-bet bet-option'>
                <div>Medium Bet</div>
                <div className='bet-info'>({betSizePercentages.medium}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{mediumBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet({amount: mediumBetAmount, fighterName: name})}>Place Bet</button>
              </div>

              <div className='large-bet bet-option'>
                <div>Large Bet</div>
                <div className='bet-info'>({betSizePercentages.large}% of Money)</div>   
                <div className='bet-cost'>        
                  <span className='money'>{largeBetAmount}</span>
                  <span className='action-points'>1</span>
                </div>
                <button className='place-bet-button standard-button' 
                  onClick={() => placeBet({amount: largeBetAmount, fighterName: name})}>Place Bet</button>
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
              <div className='stat'><label>Endurance: </label>{endurance}</div>
              <div className='stat'><label>Intelligence: </label>{intelligence}</div>
              <div className='stat'><label>Aggression: </label>{aggression}</div>
              <div className='stat'><label>Doping: </label>{doping ? 'yes':'no'}</div>
              <div className='stat'><label>Happiness: </label>{happyness}</div>
            </div>
          </div>


        </div>
        <div className='card__options'>
          <div className='heading'>Options</div>
          {optionsFighterCanBeTheTargetOf.map(
            (option: OptionData) => (
              <OptionBlock 
                key={option.name} 
                optionData={optionData} 
                onSelected={onOptionBlockSelected}
              />
            )
          )}          
        </div>
        
      </div>
    )
  }
}