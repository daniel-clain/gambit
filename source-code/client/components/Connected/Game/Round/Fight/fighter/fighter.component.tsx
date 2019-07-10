
import FighterModelImage from '../../../../../../../interfaces/game/fighter/fighter-model-image';
import styled from 'styled-components';
import { Component } from 'react';
import FighterSkeleton from '../../../../../../../interfaces/game/fighter/fighter-skeleton';
import * as React from 'react'
import { fighterModelImages } from '../../../../../../images/fighter/fighter-model-images';

const Fighter = styled.div`
	position: absolute;
	display: block;
	width: 1px;
	height: 1px;
	overflow: visible;
	.fighter{
		&__name {
			position: absolute;
			top: -20px;
			color: white;
			text-shadow: 1px 1px 2px black;
			width: 0;
			height: 0;
		}
		&__image {				
			position: absolute;
		}
	}
`

type FighterProps = {
	fighter: FighterSkeleton
}
export default class FighterComponent extends Component<FighterProps> {
	
	constructor(props){
		super(props)
	}

	componentWillLoad(){
	}
	
	render() {
		const {fighter} = this.props
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
			<Fighter className='fighter' id={fighter.name} style={fighterPosition}>
				<div className='fighter__name'>{fighter.name}</div>
				<div className='fighter__image' style={fighterImage}></div>
			</Fighter>
		)
	}
}