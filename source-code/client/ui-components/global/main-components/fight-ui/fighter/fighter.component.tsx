import * as React from 'react';
import './fighter.scss'
import FighterFightState from '../../../../../../interfaces/game/fighter-fight-state-info';
import SoundTime from '../../../../../../interfaces/game/fighter/sound-time';
import FighterModelImage from '../../../../../../interfaces/game/fighter/fighter-model-image';
import { defaultSkinModelImages } from '../../../../../images/fighter/default-skin/default-skin-model-images';
import { muscleSkinModelImages } from '../../../../../images/fighter/muscle-skin/muscle-skin-model-images';
import { fastSkinModelImages } from '../../../../../images/fighter/fast-skin/fast-skin-model-images';

const punchSound = require(`../../../../../sound-effects/punch.mp3`)
const criticalStrikeSound = require(`../../../../../sound-effects/critical-strike.mp3`)
const dodgeSound = require(`../../../../../sound-effects/dodge.mp3`)
const blockSound = require(`../../../../../sound-effects/block.mp3`)


export default class FighterComponent extends React.Component<{fighterFightState: FighterFightState}> {	
	
	soundEffects = {
    punch: new Audio(punchSound),
    criticalStrike: new Audio(criticalStrikeSound),
    dodge: new Audio(dodgeSound),
    block: new Audio(blockSound)    
	}
	processedSounds = []

	render() {
		const {name, coords, modelState, facingDirection, retreatingFromFlanked, soundsMade, onRampage, skin, strikingCenters, spirit, repositioning, direction, trapped} = this.props.fighterFightState

		const soundsToPlay = soundsMade.reduce((soundsToPlay, soundMade) => {
			if(this.processedSounds.some(sound => sound.time == soundMade.time))
				return soundsToPlay
			if(!soundsToPlay.some((sound: SoundTime) => sound.soundName == soundMade.soundName)){				
			soundsToPlay.push(soundMade)
			}
			this.processedSounds.push(soundMade)			
			return soundsToPlay
		}, [])

		if(soundsToPlay.length > 0){
			soundsToPlay.forEach((sound: SoundTime) => {
				const {punch, criticalStrike, dodge, block} = this.soundEffects
				//console.log(`**FighterComponent** - ${name} makes sound ${sound.soundName}`)
				switch(sound.soundName){
					case 'Punch' : return punch.play().catch(() => null)
					case 'Critical Strike' : return criticalStrike.play().catch(() => null)
					case 'Dodge' : return dodge.play().catch(() => null)
					case 'Block' : return block.play().catch(() => null)
				}
			})
		}

		
		const getSkinModelImages = (): FighterModelImage[] => {
			switch(skin){
				case 'Default': return defaultSkinModelImages
				case 'Muscle': return muscleSkinModelImages
				case 'Fast': return fastSkinModelImages
			}
		}

		const fighterModelImages: FighterModelImage[] = getSkinModelImages()

		const fighterModelImage: FighterModelImage = fighterModelImages.find(
			(fighterModelImage: FighterModelImage) => fighterModelImage.modelState == modelState)
		
			const fighterStyle ={
			left: coords.x, 
			bottom: coords.y,
			zIndex: modelState == 'Knocked Out' ? 0 : 1000 - Math.round(coords.y),	
		}
		const fighterImageStyle = {
			transform: (facingDirection === 'left' ? `scalex(-1) translateX(50%)` : `scalex(1) translateX(-50%)`),
			filter: `hue-rotate(${onRampage ? 330 : 0}deg)`,
			width: fighterModelImage.dimensions.width,
			height: fighterModelImage.dimensions.height
		}
		const fighterNameStyle = {
			bottom: fighterModelImage.dimensions.height + 20,
		}
		const fighterModelClass = `fighter__image--${skin.toLocaleLowerCase()}--${modelState.toLocaleLowerCase().split(' ').join('-')}`
		let flankedStyle
		if(retreatingFromFlanked)
			flankedStyle = {
				bottom: fighterModelImage.dimensions.height - 10,
			}
		
		let repositioningStyle
		if(repositioning)
			repositioningStyle = {
				bottom: fighterModelImage.dimensions.height - 10,
			}

		let trappedStyle			
		if(trapped)
			trappedStyle = {
				bottom: fighterModelImage.dimensions.height - 10,
			}

		const directionStyle = {
			transform: `rotate(${direction}deg)`
		}

		const frontStrikingCenterStyle = {
			left: strikingCenters.front.x,
			bottom: strikingCenters.front.y
		}
		const backStrikingCenterStyle = {
			left: strikingCenters.back.x,
			bottom: strikingCenters.back.y
		}
		
		return ([
			<div key='figher' className='fighter' id={name} style={fighterStyle}>
				<div className='fighter__name' style={fighterNameStyle}>
					{name}
					<span className="spirit">{
						spirit == 5 ? '😈' :
						spirit == 4 ? '😁' :
						spirit == 3 ? '🙂' :
						spirit == 2 ? '😐' :
						spirit == 1 ? '😟' :
						spirit == 0 ? '😨' : '👽'

					}</span>
				</div>
				{retreatingFromFlanked && <div className='fighter__flanked' style={flankedStyle}></div>}
				{repositioning && <div className='fighter__repositioning' style={repositioningStyle}></div>}
				{trapped && <div className='fighter__trapped' style={trappedStyle}></div>}
				
				<div className='fighter__direction' style={directionStyle}></div>
				<div 
					className={`
						fighter__image
						fighter__image--${skin.toLocaleLowerCase()} 
						${fighterModelClass}
					`} 
					style={fighterImageStyle}></div>
			</div>,
			
			<div key='strike-boxes'>
				{modelState != 'Knocked Out' && [
					<div key='front'
						className='striking-center' 
						style={frontStrikingCenterStyle}>
						<div className='striking-range'></div>
					</div>,
					<div key='back'
						className='striking-center' 
						style={backStrikingCenterStyle}>
						<div className='striking-range'></div>
					</div>
				]}
			</div>
				
			])
	} 
}