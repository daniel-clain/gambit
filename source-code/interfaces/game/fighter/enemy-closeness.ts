import Fighter from "../../../game-components/fighter/fighter";
import { Closeness } from "../../../types/figher/closeness";

export default interface EnemyCloseness{
  enemy: Fighter
  closeness: Closeness
}