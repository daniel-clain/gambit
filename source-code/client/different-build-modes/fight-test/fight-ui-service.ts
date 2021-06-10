
import Fight from '../../../game-components/fight/fight';
import Fighter from '../../../game-components/fighter/fighter';
import gameConfiguration from '../../../game-settings/game-configuration';
import { shuffle } from '../../../helper-functions/helper-functions';
import { frontEndStore } from '../../front-end-state/front-end-state';
gameConfiguration.stageDurations.maxFightDuration = 10000000


const fighters = [
/* 	new Fighter('Daniel'),
	new Fighter('Bob'),
	new Fighter('Fred'),
	new Fighter('Jeff'),
	new Fighter('Kevin'),
	new Fighter('Joe'),
	new Fighter('Steve'),
	new Fighter('Dave'),
	new Fighter('Fast'),
	new Fighter('Intelligent'),
	new Fighter('Aggressive'),
	new Fighter('Strong'),
	new Fighter('Fit'),
	new Fighter('Average'),
	new Fighter('Stupid'),
	new Fighter('Passive'),
	new Fighter('Hyper'),
	new Fighter('Tough'),*/
	new Fighter('Parth'), 
	new Fighter('Misael'),
	new Fighter('Sam'),
	new Fighter('Nicoles Anus'),
	new Fighter('Ileens nose and ears'),
	new Fighter('Andy no ass'),
	new Fighter('Ellas but plug'),
	

	//new Fighter('Superman')
]


export const fightUiService = {
	
	fight: new Fight(shuffle(fighters), null),
	fightSubscription: undefined,
	newFight(){
		this.fightSubscription?.unsubscribe()
		delete this.fight
		this.fighters.forEach(f => f.reset())
		this.fight = new Fight(this.fighters, null)
		
		this.fightSubscription = this.fight.fightUiDataSubject.subscribe(fightUiData => {
			frontEndStore.dispatch({
				type: 'Update Game UI',
				payload: {
					fightUIState: fightUiData
				}
			})
		})
		this.fight.start()
	},
	fighters: shuffle(fighters),
	frontEndStore
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

//s(f('Fast'), {baseSpeed: 10})
//s(f('Tough'), {baseStamina: 15})
s(f('Strong'), {baseStrength: 10})
s(f('Fit'), {baseFitness: 10})
s(f('Intelligent'), {baseIntelligence: 10})
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




s(f('Misale'),{
	baseStrength: 8,
	baseFitness: 3,
	baseIntelligence: 7,
	baseAggression: 7
})


s(f('Parth'),{
	baseStrength: 6,
	baseFitness: 5,
	baseIntelligence: 6,
	baseAggression: 7
})


s(f('Nicoles Anus'),{
	baseStrength: 10,
	baseFitness: 10,
	baseIntelligence: 1,
	baseAggression: 10
})


s(f('Ileens nose and ears'),{
	baseStrength: 3,
	baseFitness: 7,
	baseIntelligence: 2,
	baseAggression: 10
})

s(f('Andy no ass'),{
	baseStrength: 2,
	baseFitness: 2,
	baseIntelligence: 0,
	baseAggression: 2
})











