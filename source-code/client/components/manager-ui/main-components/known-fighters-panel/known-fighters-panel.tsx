
import * as React from 'react';
import './../fighters-list.scss'
import { KnownFighter } from '../../../../../interfaces/game-ui-state.interface';

export interface KnownFightersPanelProps{
  fighters: KnownFighter[]
  fighterSelected(fighterName: string): void
}

export default class KnownFightersPanel extends React.Component<KnownFightersPanelProps> {
    
  render(){
    const {fighters, fighterSelected} = this.props
    return (
    <div className='group-panel known-fighters'>
      <div className='heading'>Known Fighters</div>
      <div className='list fighter-list'>
        {fighters.map(fighter =>
          <div 
            className={'list__row'} 
            key={fighter.name} 
            onClick={() => fighterSelected(fighter.name)}
          >           
            <span className='list__row__image'></span>
            <span className='list__row__name'>{fighter.name}</span>
          </div>
        )}
      </div>
    </div>
    )
  }
};
