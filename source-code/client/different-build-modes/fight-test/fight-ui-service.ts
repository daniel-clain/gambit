
import { runInAction } from 'mobx';
import Fight from '../../../game-components/abilities-general/fight/fight';
import Fighter from '../../../game-components/fighter/fighter';
import gameConfiguration from '../../../game-settings/game-configuration';
import { shuffle } from '../../../helper-functions/helper-functions';
import { ServerGameUIState, ServerUIState } from '../../../interfaces/front-end-state-interface';
import { frontEndState } from '../../front-end-state/front-end-state';
gameConfiguration.stageDurations.maxFightDuration = 10000000


const fighters = [
	/*
	
	new Fighter('Superman'),
	new Fighter('Daniel'),
	new Fighter('Dave'),*/
	new Fighter('Bob'),
	new Fighter('Fred'),
	new Fighter('Jeff'),
	new Fighter('Kevin'),
	new Fighter('Joe'),
	new Fighter('Steve'), 
	new Fighter('Stupid'),
	new Fighter('Intelligent'),
	new Fighter('Intelligent2'),
	
	/*new Fighter('Average'),
	new Fighter('Passive'),
	new Fighter('Hyper'),
	new Fighter('Tough'),

	
	new Fighter('Fit'),
	new Fighter('Strong'),
	new Fighter('Aggressive'),
	new Fighter('Crafty'),
	*/
]




export const fightUiService = {
	
	fight: new Fight(shuffle(fighters), null),
	fightSubscription: undefined,
	newFight(fightersList){
		this.fightSubscription?.unsubscribe()
		delete this.fight
		const fighters = fightersList?.length ? 
		fightersList.map(f => {
			const newFighter = new Fighter(f.name)
			newFighter.fighting.stats.baseStrength = f.strength
			newFighter.fighting.stats.baseFitness = f.fitness
			newFighter.fighting.stats.baseIntelligence = f.intelligence
			newFighter.fighting.stats.baseAggression = f.aggression
			return newFighter
		}) : this.fighters
		fighters.forEach(f => f.reset())
		this.fight = new Fight(fighters, null)
		
		this.fightSubscription = (this.fight as Fight).fightUiDataSubject.subscribe(fightUiData => {
			runInAction(() => {
				frontEndState.serverUIState = {
					serverGameUIState: {
						fightUIState: fightUiData
					} as ServerGameUIState
				}
			})
		})
		this.fight.start()
	},
	fighters: shuffle(fighters)
}



const f = n => fighters.find(f => f.name == n)
const s = (f:Fighter,u) => f && Object.keys(u).forEach(updateKey => 
	f.fighting.stats[updateKey] = u[updateKey]
)

fighters.forEach(fighter => {    
	fighter.reset()
	s(f(fighter.name), {
		baseStrength: 2,
		baseFitness: 2,
		baseIntelligence: 2,
		baseAggression: 2
	})
	
})

/* f('Bob').state.hallucinating = true
f('Fred').state.hallucinating = true
f('Jeff').state.hallucinating = true
f('Kevin').state.hallucinating = true
f('Joe').state.hallucinating = true
f('Steve').state.hallucinating = true */

s(f('Tough'), {baseStamina: 15})
s(f('Strong'), {baseStrength: 10})
s(f('Fit'), {baseFitness: 10})
s(f('Intelligent'), {baseIntelligence: 10})
s(f('Intelligent2'), {baseIntelligence: 10})
s(f('Aggressive'), {baseAggression: 10})

s(f('Stupid'), {baseIntelligence: 0})
s(f('Passive'), {baseAggression: 0})

s(f('Average'), {
	baseStrength: 5,
	baseFitness: 5,
	baseIntelligence: 5,
	baseAggression: 5
})


s(f('Hyper'), {
	baseAggression: 10,
	baseFitness: 10
})
s(f('Crafty'), {
	baseIntelligence: 10,
	baseFitness: 10
})

s(f('Daniel'), {
	baseStrength: 8,
	baseFitness: 8,
	baseIntelligence: 10,
	baseAggression: 3
})

s(f('Dave'),{
	baseAggression: 8,
	baseStrength: 10,
	baseIntelligence: 1,
	baseFitness: 1
})
s(f('Sam'),{
	baseStrength: 4,
	baseFitness: 8,
	baseIntelligence: 8,
	baseAggression: 4
})

s(f('Superman'),{
	baseStrength: 10,
	baseFitness: 10,
	baseIntelligence: 10,
	baseAggression: 10
})
/* 
f('Hyper').state.hallucinating = true
f('Hyper').state.sick = true
f('Hyper').state.injured = true

 */


s(f('test1'),{
	baseStrength: 0,
	baseFitness: 10,
	baseIntelligence: 10,
	baseAggression: 0
})
s(f('test2'),{
	baseStrength: 0,
	baseFitness: 10,
	baseIntelligence: 10,
	baseAggression: 0
})












