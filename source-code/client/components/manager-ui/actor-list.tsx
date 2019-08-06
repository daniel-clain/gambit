
import * as React from 'react';

interface ActorListProps{
  onActorSelected(actor)
  list: any[]
}
export default class ActorList extends React.Component<ActorListProps>{
  render(){
    const {list, onActorSelected} = this.props
    return (  
      <div className='list'>
        {list.map(listItem => 
          <div  
            className='list__row' 
            key={listItem.name} 
            onClick={() => onActorSelected(listItem)}
          >
            <span className='list__row__image'></span>
            <span className='list__row__name'>{listItem.name}</span>
          </div>
        )}
      </div>
    )
  }
}