
import * as React from 'react';
import AbilityService from './ability-service';
import IClientAbility, { AbilityData } from '../../../interfaces/game/client-ability.interface';
import PlayerAction from '../../../interfaces/player-action';



interface AbilityCardProps{
  abilityData: AbilityData
  sendPlayerAction(playerAction: PlayerAction)
  abilityService: AbilityService
}
export default class AbilityCard extends React.Component<AbilityCardProps, AbilityData>{

  state: AbilityData
  ability: IClientAbility

  constructor(props: AbilityCardProps){
    super(props)
    this.ability = props.abilityService.allAbilities
    .find(ability => ability.name == props.abilityData.name)
  }

  componentDidMount(){
    this.setState({...this.props.abilityData})
  }

  
  confirmButtonClicked(){
   const error = this.ability.validateData(this.state)
    if(error){
      alert(error)
      return
    }
    const playerAction: PlayerAction = {
      name: 'Ability Confirmed',
      args: this.state
    }
    this.props.sendPlayerAction(playerAction)
  }
  render(){
    const {abilityData} = this.props
    const {name, target, source, additionalData} = abilityData
    const {shortDescription} = this.ability


    return (
      <div className='ability-card'>
        <div className='ability-card__name'>{name}</div>
        <div className='ability-card__short-description'>{shortDescription}</div>

        {target &&
          <div className=''>Target: {target.name}</div>}
        {source &&
          <div className=''>Source: {source.name}</div>}

        <button>set target</button>
        <button>set sourcex</button>

        
        <button className='standard-button ability-card__button' onClick={this.confirmButtonClicked.bind(this)}>Confirm</button>
      </div>
    )
  }
}