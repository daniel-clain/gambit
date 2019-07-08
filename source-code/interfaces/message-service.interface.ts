import FightUpdates from "./game/fighter/fight-updates";

export default interface IMessageService{
  onReceiveFightUpdates(callback: (value: FightUpdates) => void)
}