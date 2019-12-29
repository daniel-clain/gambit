import * as React from 'react';
import './fighter.scss'
import FighterFightState from '../../../../interfaces/game/fighter-fight-state-info';
import FighterModelImage from '../../../../interfaces/game/fighter/fighter-model-image';
import { fighterModelImages } from '../../../images/fighter/fighter-model-images';
import SoundTime from '../../../../interfaces/game/fighter/sound-time';


const punchSound = require('./../../../sound-effects/punch.mp3')
const criticalStrikeSound = require('./../../../sound-effects/critical-strike.mp3')
const dodgeSound = require('./../../../sound-effects/dodge.mp3')
const blockSound = require('./../../../sound-effects/block.mp3')


export default class FighterComponent extends React.Component<{fighterFightState: FighterFightState}> {	
	
	soundEffects = {
    punch: new Audio(punchSound),
    criticalStrike: new Audio(criticalStrikeSound),
    dodge: new Audio(dodgeSound),
    block: new Audio(blockSound)    
	}
	processedSounds = []

	render() {
		const {name, coords, modelState, facingDirection, soundsMade, onRampage} = this.props.fighterFightState

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
				console.log(`**FighterComponent** - ${name} makes sound ${sound.soundName}`)
				switch(sound.soundName){
					case 'Punch' : return punch.play()
					case 'Critical Strike' : return criticalStrike.play()
					case 'Dodge' : return dodge.play()
					case 'Block' : return block.play()
				}
			})
		}

		const fighterModelImage: FighterModelImage = fighterModelImages.find(
			(fighterModelImage: FighterModelImage) => fighterModelImage.modelState == modelState)
    const fighterStyle ={
			left: coords.x, 
			bottom: coords.y,
			zIndex: modelState == 'Knocked Out' ? 0 : 1000 - Math.round(coords.y),	
		}
		const fighterImageStyle = {
			transform: facingDirection === 'left' ? `scalex(-1)` : `scalex(1)`,
			filter: `hue-rotate(${onRampage ? 330 : 0}deg)`
		}
		const fighterNameStyle = {
			width: fighterModelImage.dimensions.width,
			bottom: fighterModelImage.dimensions.height + 10,
		}
		const fighterModelClass = 'fighter__image--' + modelState.toLocaleLowerCase().split(' ').join('-')
		return (			
			<div className='fighter' id={name} style={fighterStyle}>
				<div className='fighter__name' style={fighterNameStyle}>{name}</div>
				<div className={`fighter__image ${fighterModelClass}`} style={fighterImageStyle}></div>
			</div>
		)
	} 
}