
import * as React from 'react'
import { Modal } from '../../partials/modal/modal'
import { observer } from 'mobx-react'
import gameConfiguration from '../../../../../../../game-settings/game-configuration'
import { useState } from 'react'
import './game-explanation.scss'

const categories = ['Talent Scout', 'Fighter', 'Research', 'Employee', 'Action Points', 'Lawyer', 'Contract', 'Job Seeker', 'Promote', 'Fight', 'Bet', 'Your Fighter', 'Publicity Rating', 'Jail', 'Fighting', 'Intelligence', 'Aggression', 'Strength', 'Fitness', 'Doping', 'Illegal Actions', 'Murder', 'Assault', 'Poison', 'Sell Drugs', 'Guard', 'Thug', 'Sick', 'Hallucinating', 'Injured', 'Spirit', 'Energy', 'Rampage', 'Recover', 'Take A Dive', 'Training', 'Victory Options', 'Money', 'Investigate Manager', 'Manager', 'Private Agent', 'Surveillance'] as const
type Category = typeof categories[number]

const sortedCategories = [...categories].sort()
type Info = {
  description: string
  categories: Category[]
}
const {fightWinnings} = gameConfiguration
const {playersFighterMultiplier, playersFighterWinBase, betWinningsBase, betAmountMultiplier, totalPublicityMultiplier} = fightWinnings

const infoItems: Info[] = [
  {
    description: 'When strength or fitness is over 10 it goes down a little bit each week until back to 10',
    categories: ['Illegal Actions', 'Lawyer', 'Private Agent', 'Surveillance']      
  },
  {
    description: 'A lawyer need evidence in order to prosecute another manager. Evidence of illegal activity is obtained through the private agent doing surveillance on a fighter or manager',
    categories: ['Illegal Actions', 'Lawyer', 'Private Agent', 'Surveillance']      
  },
  {
    description: 'Your opponent managers have hidden information and hidden actions, unless you use a private agent. A private agent can investigate a manager to find out their money, fighters and employees',
    categories: ['Investigate Manager', 'Manager', 'Private Agent']      
  },
  {
    description: 'The player represents the manager in the game, your goal is to make money and outlast each other manager',
    categories: ['Manager']      
  },
  {
    description: 'The way to make money in the game is betting, you make a lot more money if your promoted fighter wins',
    categories: ['Money', 'Bet', 'Your Fighter']      
  },
  {
    description: 'There are 4 ways to win the game. All other players running out of money. Your fighter wins in final tournament. Successful Sinister Victory, successful Wealth Victory',
    categories: ['Victory Options']      
  },
  {
    description: 'Talent scout frees up your manager action points. Talent scout can research fighters and offer contracts. Skilled talent scout finds more info than the manager',
    categories: ['Talent Scout']      
  },
  {
    description: 'You can train fighters, each time you train, their strength or fitness will go up by 0.5 for each skill point of the trainer',
    categories: ['Fighter', 'Training']      
  },
  {
    description: 'Each employee has 1 action point to use per week',
    categories: ['Employee', 'Action Points']      
  },
  {
    description: 'When you research, the number next to the value is the weeks since learned, and it may not reflect the true value',
    categories: ['Talent Scout', 'Fighter', 'Research']      
  },
  {
    description: 'Recontract your fighter on the last week of contract or they will go back in the job seeker pool',
    categories: ['Fighter', 'Contract']
  },
  {
    description: 'When a lawyer successfully prosecutes you, you go to jail, which mean you can not use manager action points for the duration ',
    categories: ['Lawyer', 'Jail', 'Action Points']
  },
  {
    description: 'Your employees will remain with you until their contract expires. Only fighters can be recontracted',
    categories: ['Employee', 'Contract']
  },
  {
    description: `Job seekers will accept the highest contract they are offered. They may accept less than what they're asking for, but the closer you are to half of what they asked, the higher chance they will decline.`,
    categories: ['Job Seeker', 'Contract']
  },
  {
    description: 'When you prosecute a manager, the success chance of each account is relative to the total skill of your layers in comparison to the total skill of their lawyers. Your base chance to win is 50%, + 30% per lawyer skill. Opponent lawyers reduce this chance by 25%. Eg, if you have 2 lawyers and and each one has skill 1, and the enemy has 1 lawyer and its skill is 3, then the total chance to win each account is 50 + 30 + 30 - 75 = 35%',
    categories: ['Lawyer']
  },
  {
    description: 'When a fighter is promoted, their publicity rating goes up and it increases the chance they will be selected for an upcoming fight.',
    categories: ['Promote', 'Fight', 'Publicity Rating']
  },
  {
    description: `The fight prize pool is relative to the total publicity rating of each fighter. Increased by (${totalPublicityMultiplier}) * publicity rating of each fighter`,
    categories: ['Fight', 'Publicity Rating']
  },
  {
    description: `When your fighter wins, you will make money even if you did not bet on him. You get a base amount (${playersFighterWinBase}) plus publicity rating modifier`,
    categories: ['Your Fighter', 'Publicity Rating', 'Bet']
  },
  {
    description: `When your fighter wins, your winnings is multiplied by ${playersFighterMultiplier} of the fighters publicity rating`,
    categories: ['Your Fighter', 'Bet', 'Publicity Rating']
  },
  {
    description: `When you bet on a fighter and he wins, you make a base amount (${betWinningsBase}) plus the amount you be multiplied by (${betAmountMultiplier})`,
    categories: ['Bet']
  },
  {
    description: `Intelligent fighters are more likely check who is behind them, and reposition to where they are less vulnerable. They also know when they are doing badly and need to retreat so they can recover. An intelligent fighter waits for the opponent to attack so he can evade and then counter attack. Intelligent fighters are more aware of if an opponent is doing well or is weak and will act accordingly`,
    categories: ['Fighting', 'Intelligence']
  },
  {
    description: `Aggressive fighters have a higher chance to attack, they are less likely to do defensive actions. They have higher attack and move speeds`,
    categories: ['Fighting', 'Aggression']
  },
  {
    description: `Strong fighters have more stamina, hit harder, but move slower. They have a higher chance to block opponents with less strength`,
    categories: ['Fighting', 'Strength']
  },
  {
    description: `Fit fighters move faster, attack faster, recover faster. They have a higher chance to dodge opponents with less fitness. Fitness also increases stamina a bit and increases energy regen`,
    categories: ['Fighting', 'Fitness', 'Energy', 'Recover']
  },
  {
    description: `When you dope a fighter, it increases their strength,  fitness and aggression for 1 week only, however it permanently increases aggression by 1. When doping, fighter has a 2% chance to overdose, if more than once there is a 10% chance to overdose`,
    categories: ['Fighting', 'Doping', 'Illegal Actions']
  },
  {
    description: `When a fighter or manager is under surveillance, any illegal actions have a (70 + skillLevel * 10) chance of being discovered.`,
    categories: ['Fighting', 'Doping', 'Illegal Actions', 'Murder', 'Assault', 'Poison', 'Sell Drugs', 'Surveillance', 'Private Agent']
  },
  {
    description: `Sell drugs makes 250 + (skillLevel * 50) - (each other active dealer * 50)`,
    categories: ['Illegal Actions', 'Sell Drugs']
  },
  {
    description: `Poison Fighter has a 50% chance to make them sick, a 40% chance for them to Hallucinate, and a 10% to kill them`,
    categories: ['Illegal Actions', 'Poison']
  },
  {
    description: `When you guard a fighter, you have a chance to protect them from murder, assault and poison. You can have multiple thugs guard teh same target, their collective skill level is tested against the skill level of the assailant`,
    categories: ['Illegal Actions', 'Guard', 'Thug']
  },
  {
    description: `When a fighter is sick he starts with less stamina spirit and energy, has a little less strength and fitness, a lot less aggression and speed, takes longer to recover `,
    categories: ['Fighting', 'Sick', 'Poison']
  },
  {
    description: `When a fighter is hallucinating he has less chance to dodge, intelligence is halved, has a chance to attack while not in striking range and takes longer if no decided action`,
    categories: ['Fighting', 'Hallucinating', 'Poison']
  },
  {
    description: `When a fighter is injured he has less strength and fitness, and starts with less stamina spirit and energy, and takes longer to recover`,
    categories: ['Fighting', 'Injured', 'Assault']
  },
  {
    description: `A fighter uses energy for attacking, and for desperate retreat. Once a fighters energy is depleted, he attacks slower and can not move at high speeds. Energy recovers slowly over time, increased by fitness. Recovering regains more energy`,
    categories: ['Fighting', 'Energy']
  },
  {
    description: `When a fighter lands a critical strike there is a chance it will trigger a rampage. When rampaging, fighter does not take defensive actions, and his speed and aggression are increased. Chance to rampage is higher if the fighter has high aggression and spirit, and lower if low energy or stamina`,
    categories: ['Fighting', 'Rampage']
  },
  {
    description: `Every time a fighter lands an attack or evades an attack, he build spirit. When spirit is low they have a lower chance and success rate for offensive, and a higher chance for retreat. `,
    categories: ['Fighting', 'Spirit']
  },
  {
    description: `The fighter crouches for a short duration to regain stamina, spirit and energy. A fighter is more vulnerable while recovering`,
    categories: ['Fighting', 'Recover', 'Spirit', 'Energy']
  },
  {
    description: `Intelligent fighters chose more appropriate times to recover`,
    categories: ['Fighting', 'Recover', 'Intelligence']
  },
  {
    description: `A fighter recovers quicker based on fitness`,
    categories: ['Fighting', 'Recover', 'Fitness']
  },
  {
    description: `If a fighter has been out of action for 5 seconds, he starts to passively recover a small without crouching`,
    categories: ['Fighting', 'Recover']
  },
  {
    description: `A Hitman has a 65% + (5% * Hitman skillLevel) to successfully murder a fighter. If the fighter is being guarded, then he has a 15% - (5% * combined guard skill level) + (5% * Hitman skillLevel)`,
    categories: ['Murder']
  },
  {
    description: `A fighter taking a dive will evade attacks less, be slower in general, and have a higher chance to do nothing. He will have no aggression, unless a rampage is triggered, then will have normal rampage aggression`,
    categories: ['Fighting', 'Take A Dive']
  },

  
]

export const GameExplanationCard = observer(() => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(null)

  return (
    <Modal>
      <div className='card game-explanation-card'>
        <div className='card__heading heading'>Game Explanation</div>
        <div className="card__two-columns">
          <div className='card__two-columns__left categories'>
            {sortedCategories.map(category => 
              <div 
                key={category}
                className={`category ${category == selectedCategory ? 'category--selected' : ''}`}
                onClick={_ => setSelectedCategory(category)}
              >{category}</div>
            )}
          </div>
          <div className='card__two-columns__right info-items'>
            {infoItems.filter(i => i.categories.some(c => c == selectedCategory)).map(i => 
              <div className='info-item' key={i.description}>
                <div className='info-item__categories'>
                  {i.categories.map(category =>
                    <div 
                      key={category} 
                      onClick={_ => setSelectedCategory(category)}
                      className="info-item__category category"
                    >{category}</div>
                  )}
                </div>
                <div className='info-item__description'>
                  {i.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )

})