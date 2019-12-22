import * as React from 'react';
import './octagon-boundaries.scss'
import Octagon from './octagon';
import FighterFightStateInfo from '../../../interfaces/game/fighter-fight-state-info';
import Position from './../../../interfaces/game/fighter/position';
export default class OctagonBoundaries extends React.Component<{fighters: FighterFightStateInfo[]}>{
  

  componentDidMount(){   
    
    //this.octagon.checkIfPointIsWithinOctagon(testPoint)
  }
  render(){
    const getFighterStyle = (position: Position) =>({left: position.x, bottom: position.y})

    let pointStyles = []
    for(let pointKey in Octagon.points){
      const point = Octagon.points[pointKey]
      pointStyles.push({left: point.x, bottom: point.y})
    }
    const {fighters} = this.props
    return(
      <div className="container">
        <div className="background-top"></div>
        <div className="background-bottom"></div>
        <div className="octagon">
          {fighters.map((fighter: FighterFightStateInfo, i) => 
            <div key={i} className="fighter"  style={getFighterStyle(fighter.position)}>{fighter.name}</div>
          )}
          {pointStyles && pointStyles.map((pointStyle, i) => 
            <div key={i} className="octagon-point"  style={pointStyle}></div>
          )}
          
        </div>
      </div>
    )
  }
};
