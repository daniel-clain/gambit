import { Angle } from "../../../types/game/angle"
import FighterFighting from "./fighter-fighting"
import { fighterRetreatImplementation } from "./fighter-retreat.i"


/* 
  not yet included
    - persist direction passed flanker
      ~ without this, will move away from one toward the other, but once close enough, logic will reverse, and they will be stuck
      ~ need to persist until passed flanker
      ~ persisting will be be overruled by blocked logic
      ~ once passed or not retreating, persist will be canceled
    - reposition influenced by side that has least fighters on it
      ~ intelligent should not try to manoeuver only to get trapped, smarter to fight
*/


export function getRetreatDirection(fighting: FighterFighting): Angle{
  const {logistics, fighter} = fighting
  const {flanked} = logistics

  const i = fighterRetreatImplementation(fighting).publicProperties
  const isAgainstEdge = i.getIsAgainstEdge()


  let direction: Angle
  if(flanked){


     if(isAgainstEdge){
      const directionAlongEdgePastFlanker = i.getDirectionAlongEdgePastFlanker()

      if(directionAlongEdgePastFlanker){
        direction = directionAlongEdgePastFlanker
      }
      else{
        const directionBetweenFlankers = i.getDirectionBetweenFlankers()
        if(!!directionBetweenFlankers){
          direction = directionBetweenFlankers
        }
        else{
          console.log('trapped')
        }

      }
    }    
    else {        
      
      const directionFromFlanked = i.getDirectionFromFlanked()
      const nearEdgeInDirectionFromFlanked = i.getNearEdgeInDirection(directionFromFlanked)

      if(nearEdgeInDirectionFromFlanked){
        const directionFromFlankedInfluencedByNearEdge = i.getDirectionInfluencedByNearEdge(directionFromFlanked, nearEdgeInDirectionFromFlanked)

        direction = directionFromFlankedInfluencedByNearEdge
      }
      else {
        direction = directionFromFlanked
      }      
    } 

  }
 // not done
 // need getDirectionFromEnemyInfluencedByNearEdge
  else if(!flanked){
    if(isAgainstEdge){
      direction = i.getDirectionAlongEdgeAwayFromEnemy(logistics.closestRememberedEnemy)
    }
    else{
      const directionAwayFromClosestEnemy = i.getDirectionAwayFromEnemy(logistics.closestRememberedEnemy)
      const nearEdgeInDirectionFromClosestEnemy = i.getNearEdgeInDirection(directionAwayFromClosestEnemy)
      if(nearEdgeInDirectionFromClosestEnemy){
        direction = i.getDirectionInfluencedByNearEdge(directionAwayFromClosestEnemy, nearEdgeInDirectionFromClosestEnemy)
      }
      else {
        direction = directionAwayFromClosestEnemy
      }
    }
  }
  return direction
}
       
       








/* 
  * try to not be flanked
  * direction away relative to 2 closest flankers and edge
  * the closer each is, the more they influence
  * if a fighter is not attacking, the influence is 1/4
  * if close to edge 
    - can retreat around if not toward flanker
      ~ needs decision state to persist, because as move around edge will get closer to fighter and move around edge logic will make him turn around otherwise
        ~ cancels when has passed flanking fighter
    - can retreat between flankers if flankers are blocking retreat around edge and not closer than near
      ~ needs decision state to persist, until direction away from flanked is similar direction
    - state persists should cancel if striking range


  * retreat around edge
      - should be whatever direction is closest to way from enemy
      - when cornered, should retreat toward corner that enemy is furthest from

  * factor in striking center vs centerpoint
    - eg bottom left corner, 
      - if based on enemy centerpoint 
        ~ may be closer to bottom, then retreat 

  * trapped should trigger when 
    - both flankers are attacking and
    - and; retreat around edge is toward fighter
    - and; flankers are within close

  * severity of flanked concept
    - should only influence a desperate speed or not
   
  
*/
/* 
  - as approaching edge, based on initial direction, should commit to direction around edge
  - as fighter comes closer, direction influence become 100% based on along edge direction
  - as moving along edge, problem is, will come closer to one fighter and flanked influence would make fighter reverse direction, this would happen on repeat until trapped
    ~ to counter this, once 'moving along edge', will store store a state variable for moving along edge passed flanker. state only leaves passed flanker, then recalculates new retreat from flanked direction
  - if move along edge direction becomes within 45 degree of near fighter, cancel move  past fighter state.
    ~ high re-run retreat from flanked logic, chance to retreat between flanked or along other edge
  - if both fighter are too close to retreat around edge or between, fighter is trapped and can no long do retreat action
*/


/* 
    - direction cant be toward corner furthest from enemy, a lot of the time that corner means direction is toward enemy
    - direction along edge should be based on
      ~ direction away from enemy
      ~ how close to edge
    - once in corner, pick edge furthest from enemy, then go toward opposite corner to where he is now
*/

