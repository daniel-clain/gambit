import FighterFighting from "./fighter-fighting";
import DecideActionProbability from "./decide-action-probability";
import Fighter from "../fighter";
import { CombatAction, CooldownAction, InstantActionName, InterruptibleActionName, MainActionName, MiscAction, MoveAction } from "../../../types/fighter/action-name";
import { OptionProbability, selectByProbability, wait } from "../../../helper-functions/helper-functions";
import { ActionChain, ActionPromises, Interrupt, InterruptibleAction, MainAction } from "./action-promises";

export default class FighterActions {

  decideActionProbability: DecideActionProbability
  decidedActionLog: [MainActionName, OptionProbability<MainActionName>[]][] = []
  currentMainAction: MainActionName
  currentInterruptibleAction: InterruptibleActionName
  actionPromises: ActionPromises
  rejectCurrentAction: (interrupt?: Interrupt) => void
  nextDecisionFactors = {
    justBlocked: false,
    justDodged: false,
    justTookHit: false,
    justMissedAttack: false,
    justHitAttack: false,
  }
  
  constructor(public fighting: FighterFighting){
    this.decideActionProbability = new DecideActionProbability(fighting)
    this.actionPromises = new ActionPromises(fighting)
  }

  getActionProbabilities(){

    const { proximity, combat, movement, fighter, logistics, stopFighting, knockedOut} = this.fighting
    const {fight, hallucinating} = fighter.state  
    
    if(!proximity){
      debugger
    }

    if(!fight || knockedOut || stopFighting){
      throw('should not be trying to decide action')
    }
    
    
    let closestEnemy: Fighter = logistics.closestRememberedEnemy


    let enemyWithinStrikingRange = closestEnemy && proximity.enemyWithinStrikingRange(closestEnemy)
    

    const combatActions: CombatAction[] = ['punch', 'critical strike', 'defend']
    const moveActions: MoveAction[] = ['move to attack', 'strategic retreat', 'desperate retreat', 'cautious retreat', ]
    const otherActions: MiscAction[] = ['check flank', 'recover', 'do nothing']

    const responseProbabilities: OptionProbability<MainActionName>[] = []
    
    const includeCombatActions = enemyWithinStrikingRange || (hallucinating && closestEnemy)

    const includeMoveActions = !!closestEnemy

    if(includeCombatActions || includeMoveActions){
      this.decideActionProbability.setGeneralAttackAndRetreatProbabilities()
    }

    if(includeCombatActions)
      responseProbabilities.push(
        ...combatActions.map(action => 
          this.decideActionProbability.getProbabilityTo(action)
        )
      )

    if(includeMoveActions)
      responseProbabilities.push(
        ...moveActions.map(action =>   
          this.decideActionProbability.getProbabilityTo(action)
        )
      )

    responseProbabilities.push(
      ...otherActions.map(action =>   
        this.decideActionProbability.getProbabilityTo(action)
      )
    )
    return responseProbabilities

  }
  

  decideAction(){  
    const responseProbabilities = this.getActionProbabilities()
    const { combat, fighter, logistics} = this.fighting
    const decidedAction = selectByProbability(responseProbabilities)   


    this.decidedActionLog.unshift([decidedAction, responseProbabilities])


    let mainAction: MainAction


    if(!decidedAction){
      console.log(`${fighter.name} had no decided action, wait 1/10 a sec then decide again`, responseProbabilities); 
      mainAction = this.doNothing()
    }
    else {    
      const decidedActionIsRetreat = ['strategic retreat', 'cautious retreat', 'desperate retreat'].find(x => x == decidedAction)
      if(!decidedActionIsRetreat){
        logistics.persistAlongEdgePastFlanker = undefined
      }
      console.log(`**O decided action ${decidedAction} started (${fighter.name})`)

      mainAction = (() => {
        switch (decidedAction) {
          case 'punch':  
          case 'critical strike': 
            return combat.attack(decidedAction)          
          case 'defend':
            return combat.startDefending()
          case 'move to attack': 
          case 'cautious retreat': 
          case 'strategic retreat': 
          case 'desperate retreat': 
            return this.move(decidedAction)
          case 'recover': 
            return this.recover()
          case 'check flank': 
            return this.checkFlank()      
          case 'do nothing': 
            return this.doNothing()
        }
      })()
    }


    mainAction.promise
    .then(() => {

      console.log(`**X decided action ${decidedAction} finished (${fighter.name})`)

      if(logistics.allOtherFightersAreKnockedOut){
        this.fighting.modelState = 'Victory'
      }
      else if(fighter.fighting.knockedOut){          
        this.fighting.modelState = 'Knocked Out'          
      }
      else {
        this.decideAction()
      }
    })   
    .catch((reason) => {
      console.log('******* action catch should not be called ',reason);
    }) 
  }

  get turnAroundActionChain(): ActionChain{
    const { interruptibleAction, instantAction } = this.actionPromises
    const {turnAround} = this.fighting.movement
    return [
      interruptibleAction({name: 'turn around warmup', duration: 100}),
      instantAction({name: 'turn around', action: turnAround}),
      interruptibleAction({name: 'turn around cooldown', duration: 100})
    ]
  }

  
  checkFlank(): MainAction{
    const { mainAction } = this.actionPromises
    return mainAction({
      name: 'check flank', 
      actionChain: this.turnAroundActionChain
    })
  }
  

  move(name: MoveAction): MainAction{
    const { mainAction, interruptibleAction, instantAction } = this.actionPromises
    const {movement, timers} = this.fighting

    if(!timers.get('move action')){
      timers.start('move action')
    }

    movement.startMoveLoop(name)

    const moveAction = interruptibleAction({
      name: 'move', 
      model: name == 'cautious retreat' ? 'Defending' : 'Walking',
      duration: 1000,
    })
    
    const mainMoveAction = mainAction({
      name, 
      actionChain: [
        ...(movement.shouldTurnAround ? this.turnAroundActionChain : []),
        moveAction
      ]
    })

    mainMoveAction.promise
    .then(() => {
      console.log('move action then stop move loop');
      movement.stopMoveLoop('move action finished')

    })

    return mainMoveAction
    
    
  }
  

  recover(): MainAction{
    const {mainAction, interruptibleAction, instantAction} = this.actionPromises
    const {fighter, stats} = this.fighting
    const {sick, injured} = fighter.state
    const duration = 2500 - stats.fitness * 150 + ((sick || injured) && 1000 || 0)

    return mainAction({
      name: 'recover',
      actionChain: [
        interruptibleAction({
          name: 'recover',
          duration,
          model: 'Recovering'
        }),
        instantAction({
          name: 'recover',
          action: () => {
            this.fighting.stamina ++
            if(this.fighting.spirit < 3){
              this.fighting.spirit ++
            }
            this.fighting.energy += 3
            return Promise.resolve()
          }
        })
      ]
    })
  }

  doNothing(): MainAction{
    
    const {mainAction, interruptibleAction} = this.actionPromises
    const {hallucinating} = this.fighting.fighter.state

    const duration = 1000 + (hallucinating ? 1000 : 0)

    return mainAction({
      name: 'do nothing',
      actionChain: [interruptibleAction({
        name: 'do nothing',
        model: 'Idle',
        duration
      })]
    })
  }


};