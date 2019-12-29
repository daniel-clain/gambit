import { random } from "../../../helper-functions/helper-functions";
const enemyCloseness = ['close', 'nearby'][random(2)]
const staminaLow = !!random(2)
const noActionForAWhile = !!random(2)
class CombatAlgorithm{

  state = 'nothing'

  decideAction(){

    if(this.enemyInfront('close')){
      switch(this.respondToEnemy('close')){
        case 'retreat' :
          this.retreatFromEnemey(); break
        case 'defend' :
          this.startDefending(); break
        case 'attack' :
          this.tryToHitEnemy(); break
      }
    }
    else if(this.enemyInfront('nearby')){      
      switch(this.respondToEnemy('nearby')){
        case 'retreat' :
          this.retreatFromEnemey(); break
        case 'attack' :
          this.moveToAttackEnemey(); break
      }
    }
    else if(this.isStaminaLow()){
      this.startToRecover()
    }
    else if(this.ifNoActionForAWhile()){
      this.moveToAttackEnemey()
    }
    else{
      this.wanderAround()
    }

  }

moveLoop(){
  
}


  enemyInfront(closeness):boolean{return (enemyCloseness == closeness)}
  respondToEnemy(closeness):string{return(
    closeness === 'close' && ['retreat', 'defend', 'attack'][random(3)] || 
    closeness == 'nearby' && ['retreat', 'attack'][random(2)]
  )}
  moveToAttackEnemey(){this.state = 'moving to attack enemy'}
  retreatFromEnemey(){this.state = 'retreating from enemy'}
  startDefending(){this.state = 'defending'}
  tryToHitEnemy(){this.state = 'punching'}
  isStaminaLow():boolean{return staminaLow}
  startToRecover(){this.state = 'recovering'}
  ifNoActionForAWhile():boolean{return noActionForAWhile}
  wanderAround(){this.state = 'wandering around'}
}

describe('Combat Algorithm', () => {
  const c = new CombatAlgorithm()
  it('should set state to something', () => {
    c.decideAction()
    console.log(enemyCloseness, staminaLow, noActionForAWhile)
    console.log(c.state);
    expect(c.state).not.toBe('nothing')
  })
  
});








/* 
= what could happen while moving to attak?
-- gets attacked from behind
-- somone else comes to attack fromt the front
-- target gets knocked out
-- target runs away
-- another enemy is closer infront
-- an easy target is showing his back


= what could happen while punching
-- enemy attacks from front or back

*/



/*
= process for close encounter
----= if defend
------ defend model
------ defending state
----= if attack
------ determine crit regular or miss
--------= if crit
---------- crit sound
---------- crit model
---------- crit damage
---------- enemy model take hit
---------- after if

*/


/*
Stat Effects
=================

Intelligence
---------------
* more regular checks behind
* retreats from fight earlier to recover
* retreat when flanked
* takes advantage when enemies backs turned
* defends before attacking


Aggression
---------------
* penalty to intelligence
* more move speed when moving to attack
* higher chance to crit
* higher chance to gain rampage on crit
* more spirit gained when land attack
* less chance to look behind
* less chance to retreat


Strength
---------------
* more chance to block
* more hit damage
* penalty to speed


Speed
---------------
* more chance to dodge
* more chance to retreat
* speed boost lasts longer and faster
* faster action cast time and recover time 


Spirit
---------------
* when low less chance to block, dodge, hit attack
* when high more chance to block, dodge, hit attack
* when low more chance to retreat
* when high more chance to move to attack
* missing attack, getting hit by attack lowers spirit
* hitting attack, blocking, dodging or recovering rises spirit 


Injured
---------------
* lowers max stamina
* lowers speed
* lowers strength
* lowers aggression


*/


/*

All Possible Action States
===============================


Moving To Attack
--------------------------
* moves toward closest fighter


Doing Fast Retreat
--------------------------
* turns back
* starts speedboost cooldown
* moves away from fighter targeting
* tries to move outside of nearby range
* every second turns to see if fighter is within nearby


Doing Cautious Retreat
--------------------------
* faces figer targeting while moving away from
* when out of close range finish


Move away to recover
--------------------------
* move away from other fighters until nobody is near, then recover
* does look behind every second to check


Defending
--------------------------
* stays in defensive stance waiting to be attacked
* heightened chance to block and dodge


Blocking
--------------------------
* makes sound
* in response to attack
* after, if stamina low, give high chance to do Cautious Retreat
* after, gain high chance to attack



Dodging
--------------------------
* makes sound
* in response to attack
* after, if stamina low, give high chance to do Fast Retreat
* after, gain high chance to attack



Punching
--------------------------
* makes sound
* if hit, give high chance to attack again


Critical Striking
--------------------------
* makes sound
* gives chance to go On Rampage


On Rampage
--------------------------
* starts speed boost cooldown
* higher chance to move to attack
* lower chance to retreat
* lower chance to recover
* lower chance to look behind
* intelligence penalty


Recovering
--------------------------
* when stamina is low and nobody is nearby or coming to attack


Looking Behind
--------------------------
* take time to look behind and if nobody near then turn back


Moving Away From Flank
--------------------------
* if between nearby edge and other fighter, move perpendicular 


*/


/*

All Moving States
=========================

* Moving To Attack
* Doing Cautious Retreat
* Doing Fast Retreat
* Moving Away From Flank

*/