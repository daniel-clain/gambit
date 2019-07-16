import { GameLobbyProps } from "./game-lobby/game-lobby";
import { ManagerOptionsProps } from "./manager-options/manager-options";
import { FightEventProps } from "./fight-event/fight-event";


export interface UIViewProps{
  isActive: boolean
}

export default interface UIView{
  props: UIViewProps
}

export abstract class GameLobbyView implements UIView{
  props: GameLobbyProps
}

export abstract class ManagerOptionsView implements UIView{
  props: ManagerOptionsProps
}

export abstract class FightEventView implements UIView{
  props: FightEventProps
}


