import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { toCamelCase } from '../../../../helper-functions/helper-functions';
import { FighterInfo } from '../../../../interfaces/front-end-state-interface';
import { InfoBoxListItem } from '../../../../interfaces/game/info-box-list';
import { Skin } from '../../../../types/fighter/skin';
import { returnToLobby } from '../../../front-end-service/front-end-service';
import { frontEndState } from '../../../front-end-state/front-end-state';
import Fights from '../manager-view/manager-view-components/partials/fights-and-wins/fights';
import Wins from '../manager-view/manager-view-components/partials/fights-and-wins/wins';
import { InfoBox } from '../manager-view/manager-view-components/partials/info-box/info-box';
import './post-game.view.sass'


export const PostGame_View = observer(() => { 
  const {gameFinishedData} = frontEndState.serverUIState.serverGameUIState!

  const {winner, players} = gameFinishedData!

  return (
    <post-game>
      <winner-block>
        <winner-text>
          The Winner is {winner.name} by {winner.victoryType}
        </winner-text>
      </winner-block>
      <player-stats-list>
        {players.map(player => 
          <player-stats 
            key={player.name}
            class={player.name == winner.name ? 'is-winner' : ''}
          >
            <left-block>
              <player-name>{player.name}</player-name>
              <player-money>Money: ${player.money}</player-money>
              <player-image class={toCamelCase(player.managerImage)}/>
            </left-block>
            <players-fighters>
              {player.fighters.map(fighter =>
                <players-fighter key={fighter.name}>
                  <fighter-name>{fighter.name}</fighter-name>
                  <bottom-block>
                    <fighter-model-image class={getModelImageClass(fighter)}/>
                    <right-block>

                      <Fights numberOfFights={fighter.numberOfFights.lastKnownValue}/>
                      <Wins numberOfWins={fighter.numberOfWins.lastKnownValue}/>
                    
                      <InfoBox list={getInfoListData(fighter)}/>
                    </right-block>
                  </bottom-block>
                </players-fighter>
              )}
            </players-fighters>
          </player-stats>
        )}
      </player-stats-list>

      <button 
        className='standard-button return-button' 
        onClick={() => returnToLobby()}
      >Return to lobby</button>

    </post-game>
  )

  function getModelImageClass(fighter: FighterInfo){
    
    const strength = fighter.strength.lastKnownValue
    const fitness = fighter.fitness.lastKnownValue
    let skinName: Skin
    if(
      strength >= fitness &&
      strength > 5
    ){
      skinName = 'Muscle'
    }
    else if(
      fitness > strength &&
      fitness > 5
    ){
      skinName = 'Fast'
    }
    else{
      skinName = 'Default'

    }
    return toCamelCase(skinName)
  }

  function getInfoListData(fighter: FighterInfo): InfoBoxListItem[]{
    return ['strength', 'fitness', 'intelligence', 'aggression'].map(stat => ({
      label: stat, value: fighter[stat].lastKnownValue
    }))
  }
})
