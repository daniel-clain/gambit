
import {validate} from '@babel/types';
import {RoundState} from './../../round-controller';


import {FighterInfo, ManagerInfo, JobSeeker, Employee} from './../../../../interfaces/game-ui-state.interface';
import {ICost} from '../../../../interfaces/game/cost.interface';
import { EmployeeTypes } from '../../../../interfaces/game-ui-state.interface';
import Manager from '../manager';
import SkillLevel from '../../../../types/skill-level.type';
import Game from '../../game';
import Fighter from '../../fighter/fighter';
import { OptionData } from '../../../../client/components/manager-ui/option-card';


export type OptionNames = 
'Research fighter' |
'Train fighter' |
'Assault fighter' |
'Guard fighter' |
'Poison fighter' |
'Spy on manager' |
'Dope fighter' |
'Sue manager' |
'Discover fighter' |
'Offer contract'
/* 
'Pay off loan shark' |
'Bet on fighter' |
'Borrow from loan shark' | */

type IManagerOptionSource = 'Manager' | EmployeeTypes


type ExecuteOptionReport =  string

type OptionTargetTypes = 'Fighter' | 'Manager' | 'Job Seeker'
export interface OptionTarget{
  type: OptionTargetTypes
  name: string
}

type OptionSourceTypes = 'Employee' | 'Manager'
export interface OptionSource{
  type: OptionSourceTypes
  name: string
}

export interface SelectedOptionInfo{
  name: OptionNames
  target: OptionTarget
  source: OptionSource
  args?: any
}

interface IOption{
  name: OptionNames
}

export interface IOptionClient extends IOption{
  target: OptionTarget
  source: OptionSource
  shortDescription: string
  longDescription: string
  details: string
  confirm(): Promise<SelectedOptionInfo>
  isValidTarget(target: FighterInfo | ManagerInfo | JobSeeker): boolean
  isValidSource(source: Employee | ManagerInfo): boolean
  
}


export interface IOptionProcessor extends IOption{
  resolvedWhen: ResolvedWhenOptions
  execute(...dependencies: any[]): ExecuteOptionReport

}

type ResolvedWhenOptions = 'Instantly' | 'After Manager Options Stage' | 'End Of Round'




export class ResearchFighter implements IOption{
  //Dev note: 
  name: OptionNames = 'Research fighter'

}
export class ResearchFighterProcessor extends ResearchFighter implements IOptionProcessor{

  resolvedWhen: ResolvedWhenOptions = 'Instantly'

  constructor(private game: Game){
    super()
  }


  execute(optionInfo: SelectedOptionInfo): ExecuteOptionReport{    
    const {fighters, managers} = this.game
    const {source, target} = optionInfo
    const targetFighter = fighters.find(fighter => fighter.name == target.name)
    const sourceManager: Manager = managers.find(manager => {
      if(source.type == 'Manager' && source.name == manager.name)
        return
      if(source.type == 'Employee')
        return manager.employees.some(employee => employee.name == source.name)
    })

    const researchedFighterInfo: FighterInfo = targetFighter.getInfo()
    
    const existingFighterInfoIndex = sourceManager.knownFighters.findIndex(
      fighterInfo => fighterInfo.name == researchedFighterInfo.name)

    if(existingFighterInfoIndex >= 0)
      sourceManager.knownFighters[existingFighterInfoIndex] = researchedFighterInfo
    else
      sourceManager.knownFighters.push(researchedFighterInfo)

    return `${sourceManager.name} has gained info about ${targetFighter.name} due to ${source.name}'s research'`

  }

}


class OfferContract implements IOption{
  name: OptionNames = 'Offer contract'
}
export class OfferContractProcessor extends OfferContract implements IOptionProcessor{

  resolvedWhen: ResolvedWhenOptions = 'End Of Round'
  constructor(private game: Game){
    super()
  }


  execute(optionInfo: SelectedOptionInfo): ExecuteOptionReport{    
    if(optionInfo.name != 'Offer contract')
      return

    const {fighters, managers} = this.game
    const {source, target, args} = optionInfo
    const targetFighter: Fighter = fighters.find(fighter => fighter.name == target.name)
    const manager: Manager = managers.find(manager => manager.name == source.name)    

    const fighterAcceptedContract: boolean = targetFighter.contractOffered(args.offeredContract)

    if(fighterAcceptedContract){
      manager.fighters.push(targetFighter)
      targetFighter.state.manager = manager
    }
    
    
    return `${manager.name} contract offer to ${targetFighter.name} was ${fighterAcceptedContract ? 'accepted' : 'declined'}'`

  }

}
export class OfferContractClient extends OfferContract implements IOptionClient{
  target: OptionTarget;  
  source: OptionSource;
  shortDescription: 'offer a business contract';
  longDescription: string;
  details: string;
  offeredContract
  
  private getSelectedOptionInfo(): SelectedOptionInfo{
    if(this.target == null || this.source == null || this.offeredContract == null)    
    return {
      name: this.name,
      target: this.target,
      source: this.source,
      args: {offeredContract: this.offeredContract}
    }
  }


  isValidTarget(target: FighterInfo | JobSeeker): boolean{
    let fighter = target as FighterInfo
    if(
      fighter.inNextFight != true && 
      fighter.isPlayersFighter != true && 
      fighter.manager == null
    ) return true
    else return false
  }
  isValidSource(source: Employee | ManagerInfo): boolean{
    if(source.options.some(optionName => optionName == 'Offer contract')) 
      return true
    else return false
  }


  confirm(): Promise<SelectedOptionInfo> {
    return new Promise((resolve, reject) => {
      if(!this.target) reject('target undefined')
      if(!this.source) reject('source undefined')
      resolve(this.getSelectedOptionInfo())
    });
  }

}


export class TrainFighter implements IOption{
  name: OptionNames = 'Train fighter'
}
export class DiscoverFighter implements IOption{
  name: OptionNames = 'Discover fighter'
}
export class GuardFighter implements IOption{
  name: OptionNames = 'Guard fighter'
}


export default class  OptionsProcessor{
  private optionProcessors: IOptionProcessor[]
  storedSelectedOptions: SelectedOptionInfo[] = []
  
  constructor(private game: Game){
    const { fighters, managers, roundController } = game
    roundController.roundStateUpdateSubject.subscribe(this.onRoundUpdate)
    this.optionProcessors = [
      new ResearchFighterProcessor(game),
      new OfferContractProcessor(game),
    ]
  }

  onRoundUpdate(roundState: RoundState){
    if(roundState.stage == 'Pre Fight News'){
      console.log('round Stage :', roundState.stage);
      this.processStoredOptions('After Manager Options Stage')
    }

    if(roundState.stage == 'Post Fight Report'){
      console.log('round Stage :', roundState.stage);
      this.processStoredOptions('End Of Round')
    }
  }
  processStoredOptions(resolvedWhen: ResolvedWhenOptions){
    

    const optionProcessors: IOptionProcessor[] = this.storedSelectedOptions.map(
      optionInfo => this.optionProcessors.find(optionProcessor => optionProcessor.name == optionInfo.name))
    
    optionProcessors.forEach(optionProcessor => {
      if(optionProcessor.resolvedWhen == resolvedWhen){
        const optionInfoIndex = this.storedSelectedOptions.findIndex(
          option =>option.name = optionProcessor.name)
        const optionInfo = this.storedSelectedOptions.splice(optionInfoIndex, 1)
        optionProcessor.execute(optionInfo)
      }
    })
  }


  processSelectedOption(optionInfo: SelectedOptionInfo): {error: string}{
    const { managers } = this.game
    const { target, source} = optionInfo
    if(optionInfo.source.type == 'Manager'){
      const manager = managers.find(manager => manager.name == source.name)
      if(manager.actionPoints > 0){
        return {error: 'dont have enough action points'}
      }
      else 
        manager.actionPoints --        
    }

    if(source.type == 'Employee'){
      const employee: Employee = managers.reduce(
        (foundEmployee: Employee, manager): Employee => {
          if(foundEmployee)
            return foundEmployee
          else{
            let foundEmployee: Employee = manager.employees.find(
              employee => employee.name == source.name)
            if(foundEmployee)
              return foundEmployee
          }
        }, null
      )

      if(employee.actionPoints > 0){
        return {error: 'employee dont have enough action points'}
      }
      else 
        employee.actionPoints --        
    }

    this.storedSelectedOptions.push(optionInfo)
    this.processStoredOptions('Instantly')
  }

}


export interface OptionService{
  optionName: OptionNames
  validateSource()
  validateTarget()
}

interface OptionInfo{
  name: OptionNames
  shortDescription: string
  longDescription: string
}

export interface OptionValidator{
  
  optionName: OptionNames
  isValidTarget(x: any): Error
  isValidSource(x: any): Error
  validateSource(optionSource: OptionSource): Error
  validateTarget(optionTarget: OptionTarget): Error
  validate(option: OptionData): Error
}
class OfferContractValidator implements OptionValidator{
  optionName: OptionNames = 'Research fighter';
  validateSource(optionSource: OptionSource): Error {
    return Error('Method not implemented.');
  }
  validateTarget(optionTarget: OptionTarget): Error {
    return Error('Method not implemented.');
  }
  validate(option: OptionData): Error{
    return Error('Method not implemented.');
  }

  isValidTarget(fighter: FighterInfo): Error{
    if(fighter.isPlayersFighter == true)
      return Error('resercth fighter can not target managers fighter')
  }
  isValidSource(source: Employee | ManagerInfo): Error{
    if(source.options.some(option => option == 'Research fighter') == false)
      return Error('source does not have research fighter option')
  }
}

class ResearchFighterValidator implements OptionValidator{
  optionName: OptionNames = 'Research fighter';
  validateSource(optionSource: OptionSource): Error {
    return Error('Method not implemented.');
  }
  validateTarget(optionTarget: OptionTarget): Error {
    return Error('Method not implemented.');
  }
  validate(option: OptionData): Error{
    return Error('Method not implemented.');
  }

  isValidTarget(fighter: FighterInfo): Error{
    if(fighter.isPlayersFighter == true)
      return Error('resercth fighter can not target managers fighter')
  }
  isValidSource(source: Employee | ManagerInfo): Error{
    if(source.options.some(option => option == 'Research fighter') == false)
      return Error('source does not have research fighter option')
  }
}


export const optionValidators: OptionValidator[] = [
  new ResearchFighterValidator(),
  new OfferContractValidator()
]

export const optionsInfoList: OptionInfo[] = [
  {
    name: 'Research fighter',
    shortDescription: `
    Chance to gain updated info about fighter's public stats    
    `,
    longDescription: ``
  }
]
/* 


type DolphinFin = 'big' | 'small'

interface test{
  punchDolphin(dolphin): DolphinFin
  thing2: number[]
}


interface boobs{
  punchDolphin(dolphin): DolphinFin
}

const kevin = ((): boobs => {
  const self: any = {}
  self.punchDolphin = (dolphin): DolphinFin => {
    return 'small'
  }
  return self
})()

const jake = (kevin: boobs): test => {
  
  let self = {}
  self.punchDolphin
  self.thing2 = [2,4]

  return self
}
interface IFarts{
  fart(environment)
}
interface IFarter extends IFarts{
  name
}

interface Environment{
  smells: Smell[]
}

type FartSmell = 'really bad' | 'fucked up' | 'nasty'

type Smell = FartSmell

const isAFarter = (farter) => {
  const fart = (environment: Environment) => {
    console.log(`${farter.name} farted, lol`);
    if(!environment.smells)
      environment.smells = []

    if(farter.eaten.find(food => food == 'Hot Curry'))
      environment.smells.push(random(2) ? 'fucked up' : 'really bad')    
    else
      environment.smells.push('nasty')
  }
  return {fart}
}
interface ISniffer{
  sniff(...smells: Smell[])
}

const isASniffer = (hostState): ISniffer  => {
  const sniff = (...smells: []) => {
    smells.forEach(smell => {
      console.log(`${hostState.name} can smell something ${smell}`);
    })
  }
  return {sniff}
}
type FoodTypes = 'Bananna' | 'Hot Curry'
type Food = FoodTypes
interface IEater{
  eaten: Food[]
  eat(food: Food)
}

const isAnEater = (eater)  => {
  eater.eaten = []
  const eat = (food: Food) => (
    eater.eaten.push(food),
    console.log(`${eater.name} just ate ${food}`)
  )
  return {eat}
}

interface IPerson extends IFarter, ISniffer, IEater{
  eyes
  name
  money
}
this.carrot ='bananas'
const newPerson = (name): IPerson => {
  const state = {
    name,
    eyes: 2,
    money: 500
  }
  return Object.assign({}, 
    {...state},
    isAnEater(state),
    isAFarter(state),
    isASniffer(state)
  )
}
console.log('hello world');
const bob: IPerson = newPerson('Bob')
const jim: IPerson = newPerson('Jim')

jim.eat('Hot Curry')

bob.fart(this)
bob.fart(this)
bob.fart(this)

jim.sniff(this.smells)
jim.fart(this)


bob.sniff(this.smells)

console.log(`${jim.name} has eaten`, ...jim.eaten)


 */
