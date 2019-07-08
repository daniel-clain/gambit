import FighterSkeleton from "./fighter/fighter-skeleton";

export default class FightSkeleton{
  countDown: number
  timeRemaining: number
  fighters: FighterSkeleton[]
  winner?: FighterSkeleton
}