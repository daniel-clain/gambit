
import FighterModelImage from '../../../../../../../interfaces/game/fighter/fighter-model-image';
import styled from 'styled-components';
import { fighterModelImages } from './fighter-model-images';
import { Component } from 'react';
import FighterSkeleton from '../../../../../../../interfaces/game/fighter/fighter-skeleton';
import * as React from 'react'

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

		const Fighter = styled.div`
			.fighter{
				left: ${fighter.position.x};
				bottom: ${fighter.position.y};
				z-index: ${fighterModelImage.modelState == 'Knocked Out' ? 0 : 1000 - fighter.position.y};
				position: absolute;
				display: block;
				width: 1px;
				height: 1px;
				overflow: visible;
				&__name {
					position: absolute;
					top: -20px;
					color: white;
					text-shadow: 1px 1px 2px black;
					width: 0;
					height: 0;
				}
				&__image {				
					width: ${fighterModelImage.dimensions.width};
					height: ${fighterModelImage.dimensions.width};
					background-image: ${fighterModelImage.imageName};
					position: absolute;
					transform:${fighter.facingDirection === 'left' ? `scalex(-1)` : `scalex(1)`};
				}
			}
		`
		
		return (			
			<Fighter className='fighter'>
				<div className='fighter__name'>{fighter.name}</div>
				<div className='fighter__image'></div>
			</Fighter>
		)
	}
}
