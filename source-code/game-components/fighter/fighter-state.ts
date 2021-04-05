
import { ActiveContract, GoalContract } from '../../interfaces/game/contract.interface';
import Fight from "../fight/fight";
import { Manager } from '../manager';
import { Employee } from '../../interfaces/front-end-state-interface';



export default class FighterState{
  doping: boolean = false
  injured: boolean = false
  hallucinating: boolean = false
  sick: boolean = false
  dead: boolean = false
  activeContract?: ActiveContract
  goalContract?: GoalContract
  guards: Employee[] = []
  onARampage: boolean
  
  trainingProgress = 0
  manager?: Manager
  fight?: Fight
  
  publicityRating = 0

  numberOfFights: number = 0
  numberOfWins: number = 0




}


