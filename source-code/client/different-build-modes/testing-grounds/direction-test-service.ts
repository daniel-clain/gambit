import { observable } from "mobx"
import { getOppositeDirection, getSmallestAngleBetween2Directions, add2Angles, toAngle } from "../../../game-components/fighter/fighter-fighting/proximity"


function getDirectionAway(){
  const {enemies, edgeDir, edgeDist} = state
  const {enemy1dir, enemy1dist, enemy2dir, enemy2dist} = enemies
  const awayFromEnemy1 = getOppositeDirection(toAngle(enemy1dir))
  const awayFromEnemy2 = getOppositeDirection(toAngle(enemy2dir))
  
  const {angleBetween, crosses0} = getSmallestAngleBetween2Directions(awayFromEnemy1, awayFromEnemy2)



  const enemy1DistanceInfluence = enemy1dist / (enemy1dist + enemy2dist)
  const enemy2DistanceInfluence = enemy2dist / (enemy1dist + enemy2dist)


  let factoredDistanceAway
  if(crosses0){
    if(awayFromEnemy1 > awayFromEnemy2){
      factoredDistanceAway = add2Angles(awayFromEnemy1, toAngle(angleBetween*enemy1DistanceInfluence))
    }
    else{
      factoredDistanceAway = add2Angles(awayFromEnemy2, toAngle(angleBetween*enemy2DistanceInfluence))
    }
  }
  else{
    if(awayFromEnemy1 < awayFromEnemy2){
      factoredDistanceAway = add2Angles(awayFromEnemy1, toAngle(angleBetween*enemy1DistanceInfluence))
    }
    else{
      factoredDistanceAway = add2Angles(awayFromEnemy2, toAngle(angleBetween*enemy2DistanceInfluence))
    }

  }


  return factoredDistanceAway
}


export const state = observable({
  enemies: {
    enemy1dir: 290,
    enemy1dist: 100,
    enemy2dir: 210,
    enemy2dist: 300,
    edgeDir: 0,
    edgeDist: 100
  },
  edgeDir: 0,
  edgeDist: 100,
  get directionAway(){return getDirectionAway()}
})

/* 
  - the closer the point is, the more its influenced
  - each point competes for influence
  - scenarios
    ~ both points far/near/close/striking
      * away dir average of both, no influence
    ~ both passed far and different distances
      * away dir average of both, no influence
    ~ one far, and two a little bit closer
      * 5% influence of 2
    ~ one striking and two a little bit closer that far
      * 95% influence of 1
    ~ one near and two close
      * 
*/