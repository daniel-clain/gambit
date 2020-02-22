
import * as React from 'react';
import '../fighters-list.scss'
import { FighterInfo } from '../../../../../../interfaces/game-ui-state.interface';

export interface YourFightersPanelProps{  
  fighters: FighterInfo[]
  fighterSelected(fighterName: string): void
}

export default class YourFightersPanel extends React.Component<YourFightersPanelProps> {
    
  render(){
    const {fighters, fighterSelected} = this.props
    return (
      <div className='group-panel your-fighters'>
        <div className='heading'>Your Fighters</div>
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
