
/* import FighterModelImage from '../../../../interfaces/game/fighter/fighter-model-image';
import { fighterModelImages } from '../../../images/fighter/fighter-model-images'; */
import * as React from 'react';
import './fighter.scss'
import FighterFightStateInfo from '../../../../interfaces/game/fighter-fight-state-info';


type FighterProps = {
	fighter: FighterFightStateInfo
}
export default class FighterComponent extends React.Component<FighterProps> {
	
	constructor(props){
		super(props)
	}

	componentWillLoad(){
	}
	
	render() {
		return <div>f{/* {this.props.fighter.name} */}</div>
		/* const {fighter} = this.props
		const fighterModelImage: FighterModelImage = fighterModelImages.find(
			(fighterModelImage: FighterModelImage) => fighterModelImage.modelState == fighter.modelState)

		const fighterPosition = {
			left: `${fighter.position.x}px`,
			bottom: `${fighter.position.y}px`,
			zIndex: fighterModelImage.modelState == 'Knocked Out' ? 0 : 1000 - fighter.position.y
		}
		const fighterImage = {

			width: `${fighterModelImage.dimensions.width}px`,
			height: `${fighterModelImage.dimensions.height}px`,
			backgroundImage: `url(${fighterModelImage.imageName})`,
			transform: fighter.facingDirection === 'left' ? `scalex(-1)` : `scalex(1)`
		}
		
		return (			
			<div className='fighter' id={fighter.name} style={fighterPosition}>
				<div className='fighter__name'>{fighter.name}</div>
				<div className='fighter__image' style={fighterImage}></div>
			</div>
		)*/
	} 
}