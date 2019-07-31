import {ICost} from '../../../../interfaces/game/cost.interface';
import { EmployeeTypes } from '../../../../interfaces/game-ui-state.interface';
export type ManagerOptionNames = 
'Research fighter' |
'Get fighter sponsored' |
'Train fighter' |
'Send thugs to assault fighter' |
'Send body guards to protect fighter' |
'Assasinate fighter' |
'Send private investigator to spy on manager' |
'Give performance enhancing drugs to fighter' |
'Borrow from loan shark' |
'Sue manager' |
'Pay off loan shark' |
'Discover fighter' |
'Offer contract' |
'Bet on fighter'

type IManagerOptionSource = 'Manager' | EmployeeTypes

export interface IManagerOption{
  name: ManagerOptionNames
  getCost(source?: IManagerOptionSource): ICost
}
export abstract class ManagerOption implements IManagerOption{

  name: ManagerOptionNames
  getCost(source: IManagerOptionSource): ICost {
    return {money: 0, actionPoints: 1}
  }
}
export class SueManager extends ManagerOption{
  name: 'Sue manager'
}
export class ResearchFighter extends ManagerOption{
  name: 'Research fighter'

  getCost(source: IManagerOptionSource): ICost{
    if(source == 'Manager')
      return {money: 40, actionPoints: 1}

    return {money: 0, actionPoints: 1}
  }
}
export class TrainFighter extends ManagerOption{
  name: 'Train fighter'
  
  getCost(source: IManagerOptionSource): ICost{
    if(source == 'Manager')
      return {money: 70, actionPoints: 1}

    return {money: 0, actionPoints: 1}
  }
}
export class DiscoverFighter extends ManagerOption{
  name: 'Discover fighter'
  
  getCost(source: IManagerOptionSource): ICost{
    if(source == 'Manager')
      return {money: 30, actionPoints: 1}

    return {money: 0, actionPoints: 1}
  }
}
export class OfferContract extends ManagerOption{
  name: 'Offer contract'
  
  getCost(): ICost{
    return {money: 50, actionPoints: 1}
  }
}

export class BetOnFighter extends ManagerOption{
  name: 'Bet on fighter'
}

const managerOptions: IManagerOption[] = [
  new DiscoverFighter(),
  new OfferContract(),
  new TrainFighter(),
  new ResearchFighter(),
  new BetOnFighter()

]

export default managerOptions





