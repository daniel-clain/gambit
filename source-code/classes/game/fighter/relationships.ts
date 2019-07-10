import { Observable } from "rxjs";
import Dimensions from "../../../interfaces/game/fighter/dimensions";

interface HasFighterStrategies{
  fighterStrategies: FighterStrategies[]
}
interface HasFighterAttributes{

}

interface FighterState{
  isFighting: Observable<boolean>
}

class FighterImplementationCode{
  constructor(private fighter: Fighter){}
    startFightingStrategyAlgorithm(){

    this.fighter.state.isFighting.subscribe(isFighting => {
      if(isFighting){
        if(this.fightingLoopActive)
          throw 'fighter should have not been set to fight when he is already fighting'
        else
          this.fightingLoop = 
        }
      }
    })
  }
}






type FighterStrategyName = 'Attack closest fighter'

interface FighterStrategy{

  fighter: Fighter
  name: FighterStrategyName
  goal: string
  priority: number
  interuptable: boolean
  execute(): void
}

class AttackClosestFighter implements FighterStrategy{
  name: FighterStrategyName = 'Attack closest fighter'
  goal = 'If full stamina and has not attacked in a while, move to attack'

  constructor(fighter: Fighter){
    super(fighter)
  }

  get priority(): number {
    return 1
  }
  
  execute(): void {
    super.execute()
    const closestFighter: Fighter = this.fighter.getClosestFighter()
    this.fighter.fighterTargetedForAttack = closestFighter
    if(closestFighter)
    switch(this.fighter.getFighterClosenessRating(closestFighter)){
      case 'Close' : {
        this.fighter.tryToHitFighter(this.fighter.fighterTargetedForAttack)
      }
      case 'Near' :
      case 'Far' : {
        this.fighter.moveTowardFighter(this.fighter.fighterTargetedForAttack)
      }
    }
  }
}

type FighterRelationshipName = 'FighterStrategiesRelationship' | 'FighterFightRelationship'




interface ExposedMethodsAndProperties{
  giveInstruction: any
  makeRequest: any
  properties: any
}

interface FightExposedMethodsToFighter implements ExposedMethodsAndProperties{
  
  giveInstruction: {}
  makeRequest: {    
    getOtherFightersInTheFight: Fighter[]
    getFightBoundaryDimensions: Dimensions
  }
  properties: {}
}

abstract class Relationship{
  name: string
}


interface FighterRelationship extends Relationship{
  name: FighterRelationshipName
}

interface FightRelationship extends Relationship{

}


class FighterExposedMethodsToFight implements ExposedMethodsAndProperties{
  giveInstruction = {    
    startFighting: null,
    stopFighting: null
  }
  makeRequest = {}
  properties = {}
}


class FighterFightRelationship implements FighterRelationship, FightRelationship{
  name: 'FighterFightRelationship'
  fighterExposedMethodsToFight: FighterExposedMethodsToFight
  fightExposedMethodsToFighter: FightExposedMethodsToFighter

  constructor(fighter: Fighter, fight: Fight){
    this.fighterExposedMethodsToFight = {
      giveInstruction: {
        startFighting: fighter.startFighting,
        stopFighting: fighter.stopFighting
      },
      makeRequest: {},
      properties: {}
    }

    this.fightExposedMethodsToFighter = {
      giveInstruction: {
      
      },
      makeRequest: {        
        getOtherFightersInTheFight: fight.getOtherFightersInTheFight,
        getFightBoundaryDimensions: fight.getFightBoundaryDimensions
      }
    }
  }

}
interface MakesRelationships{
  relationships: Relationship[]
  addNewRelationship(relationship: Relationship)
}

class Fighter implements MakesRelationships {
  name: string
  relationships: FighterRelationship[] = []

  addNewRelationship(relationship: FighterRelationship){
    console.log(relationship.name);
    switch(relationship.name){
      case 'FighterFightRelationship' : {
        console.log(`fighter ${this.name} has just made a ${relationship.name} relationship`);
        this.relationships.push(relationship)
      }
    }
  }

  startFighting(){
    console.log('i was told to start fighting');

  }
  
  stopFighting(){

  }




}

const fighter = new Fighter()

interface ManagerRelationship{

}

interface FightRelationship extends Relationship{
}


class Fight implements MakesRelationships{
  constructor(private fightDate){

  }
  relationships: FightRelationship = {
    fighters: [],
    managers: [],

  }

  addFighterToFighter(){

  }

  getOtherFightersInTheFight(){
    
  }

  getFightBoundaryDimensions(): Dimensions{
    return
  }

  startFight(){
    const {fighters} = this. relationships
    fighters.forEach((relationship: FighterFightRelationship) => {
      relationship.fighterExposedMethodsToFight.giveInstruction.startFighting()
    })
  }


}

class FightManager{

  constructor(){
    const fighter = new Fighter()
    const fight = this.createNewFight()

    this.addFighterToFight(fighter, fight)
  }
  createNewFight(){
    const fightDate = new Date()
    return new Fight(fightDate)
  }

  addFighterToFight(fighter: Fighter, fight: Fight){
    const fighterFightRelationship = new FighterFightRelationship(fighter, fight)
    fighter.addNewRelationShip()
  }


}

























