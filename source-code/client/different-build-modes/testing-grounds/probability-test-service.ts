import { makeObservable, observable, runInAction } from "mobx";
import Fight from "../../../game-components/fight/fight";
import Fighter from "../../../game-components/fighter/fighter";
import { ServerGameUIState } from "../../../interfaces/front-end-state-interface";
import { frontEndState } from "../../front-end-state/front-end-state";


const testFighter = new Fighter('TestFighter')
const inFront = new Fighter('InFront')
const behind = new Fighter('Behind')

export const fight = new Fight([testFighter, inFront, behind], null)

export const state = observable({
  updates: 0,
  dir: 0
})

export function initialSetup(){
  placeFighters()
  setBaseStats()


  function placeFighters(){    

    testFighter.fighting.movement.coords = {x: 240, y: 150}
    inFront.fighting.movement.coords = {x: 200, y: 150}
    behind.fighting.movement.coords = {x: 300, y: 150}
  
    testFighter.fighting.facingDirection = 'left'
    inFront.fighting.facingDirection = 'right'
    behind.fighting.facingDirection = 'left'
    
  }
  function setBaseStats(){
    fight.fighters.forEach(({fighting}) => {
      fighting.stats.baseAggression = 5
      fighting.stats.baseFitness = 5
      fighting.stats.baseIntelligence = 5
      fighting.stats.baseStrength = 5
      fighting.spirit = 3
      fighting.stamina = fighting.stats.maxStamina
      fighting.energy = fighting.stats.maxEnergy
      
      fighting.otherFightersInFight = fight.fighters
      .filter(fighter => fighter.name != fighting.fighter.name)
      fighting.fightStarted = true
    })
  }
  update()
}

export function update(){
  runInAction(() => {
    state.updates ++
    frontEndState.serverUIState = {
      serverGameUIState: {
        fightUIState: fight.fightUiData
      } as ServerGameUIState
    }
  })
}


export function getProbabilities(){
  const probabilities = fight.fighters.find(f => f.name == 'TestFighter').fighting.actions.getActionProbabilities()
  console.log(probabilities)
}

export function setMemoryOfBehindElapsed(val: number){
  const timer = testFighter.fighting.timers.get('memory of enemy behind')
  timer.cancel()
  //timer.timeElapsed = val
}