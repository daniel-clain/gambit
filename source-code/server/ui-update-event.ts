type UIUpdateTypes = 'Game Update' | 'Fight Event' | `Manager's Office` | 'Game Lobby' | 'Fighter'

export default interface UIUpdateEvent {
  type: UIUpdateTypes
};
