
import { Closeness } from "../../../../types/fighter/closeness";
import FighterFighting from "../fighter-fighting";


export const getProbabilityToRecover = (fighting: FighterFighting): number => {
  const { intelligence } = fighting.stats
  const { proximity, logistics, spirit, movement, energy, timers} = fighting
  const enemyInFront = logistics.closestEnemyInFront

  const enemyBehind = logistics.rememberedEnemyBehind

  const enemyInFrontCloseness = enemyInFront && proximity.getEnemyCombatCloseness(enemyInFront)

  const hasRetreatOpportunityFromInFront = enemyInFront && logistics.hasRetreatOpportunity(enemyInFront)

  const inFrontOnRampage = enemyInFront && logistics.enemyIsOnARampage(enemyInFront)


  const enemyBehindCloseness = enemyBehind && proximity.getEnemyCombatCloseness(enemyBehind)

  const hasRetreatOpportunityFromBehind = enemyBehind && logistics.hasRetreatOpportunity(enemyBehind)
  const behindOnRampage = enemyBehind && logistics.enemyIsOnARampage(enemyBehind)

  const lowStamina = logistics.hasLowStamina
  const lowSpirit = logistics.hasLowSpirit


  const notFullStamina = !logistics.hasFullStamina
  const notFullSpirit = !logistics.hasFullSpirit


  const invalid: boolean =
    logistics.hasFullStamina ||
    logistics.onARampage

  if (invalid)
    return 0


  let probability = 10


  if(enemyInFrontCloseness > Closeness['close'] && 
  enemyBehindCloseness > Closeness['close']){
        
    if (proximity.againstEdge){
      probability += 4
    }


    if (logistics.lowEnergy){
      probability += 4

      if(movement.moveAction == 'desperate retreat'){
        probability += 4
      }
    }
  }  
  
  if (logistics.justTookHit)
    probability += 20 - spirit * 2
  

  if (enemyBehind){
    if(enemyBehindCloseness >= Closeness['far']){     
      if(!enemyInFront){
        behindFar()
      } 
      else if(enemyInFrontCloseness >= Closeness['far']){
        inFrontFarAndBehindFar()
      }    
      else if(enemyInFrontCloseness == Closeness['nearby']){
        inFrontNearAndBehindFar()
      }    
      else if(enemyInFrontCloseness == Closeness['close']){
        inFrontCloseAndBehindFar()
      }
      else if(enemyInFrontCloseness == Closeness['striking range']){
        inFrontStrikingAndBehindFar()
      }

       
    }

    else if(enemyBehindCloseness == Closeness['nearby']){
      if(!enemyInFront){
        behindNear()
      } 
      else if(enemyInFrontCloseness >= Closeness['far']){
        inFrontFarAndBehindNear()
      }    
      else if(enemyInFrontCloseness == Closeness['nearby']){
        inFrontNearAndBehindNear()
      }    
      else if(enemyInFrontCloseness == Closeness['close']){
        inFrontCloseAndBehindNear()
      }
      else if(enemyInFrontCloseness == Closeness['striking range']){
        inFrontStrikingAndBehindNear()
      }   
    }

    else if(enemyBehindCloseness == Closeness['close']){
      if(!enemyInFront){
        behindClose()
      }
      else if(enemyInFrontCloseness >= Closeness['far']){
        inFrontFarAndBehindClose()
      }    
      else if(enemyInFrontCloseness == Closeness['nearby']){
        inFrontNearAndBehindClose()
      }    
      else if(enemyInFrontCloseness == Closeness['close']){
        inFrontCloseAndBehindClose()
      }  
      
      else if(enemyInFrontCloseness == Closeness['striking range']){
        inFrontStrikingAndBehindClose()
      }  
    }

    else if(enemyBehindCloseness == Closeness['striking range']){
      if(!enemyInFront){
        behindStriking()
      }
      else if(enemyInFrontCloseness >= Closeness['far']){
        inFrontFarAndBehindStriking()
      }    
      else if(enemyInFrontCloseness == Closeness['nearby']){
        inFrontNearAndBehindStriking()
      }    
      else if(enemyInFrontCloseness == Closeness['close']){
        inFrontCloseAndBehindStriking()
      }  
      
      else if(enemyInFrontCloseness == Closeness['striking range']){
        inFrontStrikingAndBehindStriking()
      }  
    }

  } 
  

  else if(enemyBehind === null){
    if(enemyInFrontCloseness >= Closeness['far']){
      inFrontFar()
    }    
    else if(enemyInFrontCloseness == Closeness['nearby']){
      inFrontNear()
    }    
    else if(enemyInFrontCloseness == Closeness['close']){
      inFrontClose()
    } 
    else if(enemyInFrontCloseness == Closeness['striking range']){
      inFrontStriking()
    }

    if(enemyInFrontCloseness > Closeness['Close']){
      
      if (proximity.againstEdge){
        probability += 4
      }

      if (logistics.lowEnergy){
        probability += 4

        if(movement.moveAction == 'desperate retreat'){
          probability += 4
        }
      }
    }
  }
  

  else if(enemyBehind === undefined){
    const otherFighters = logistics.otherFightersStillFighting
    const allFightersInFront = logistics.enemiesInFront.length == otherFighters.length

    if(allFightersInFront){
      if(enemyInFrontCloseness >= Closeness['far']){
        inFrontFar()
      }    
      else if(enemyInFrontCloseness == Closeness['nearby']){
        inFrontNear()
      }    
      else if(enemyInFrontCloseness == Closeness['close']){
        inFrontClose()
      }   
      else if(enemyInFrontCloseness == Closeness['striking range']){
        inFrontStriking()
      }
    }
    else{
      if(enemyInFrontCloseness >= Closeness['far']){
        inFrontFarAndDontKnowBehind()
      }    
      else if(enemyInFrontCloseness == Closeness['nearby']){
        inFrontNearAndDontKnowBehind()
      }    
      else if(enemyInFrontCloseness == Closeness['close']){
        inFrontCloseAndDontKnowBehind()
      }   
      else if(enemyInFrontCloseness == Closeness['striking range']){
        inFrontStrikingAndDontKnowBehind()
      }

    }

  }

  
  if (probability < 0)
    probability = 0

  return probability



  /* functions */

  function inFrontFarAndBehindFar(){
    //console.log('inFrontFarAndBehindFar');
    probability += (10-energy)
    if (lowStamina)
      probability += 6 + intelligence * 3
  
    if (lowSpirit)
      probability += 6 + intelligence * 3

    if (notFullStamina)
      probability += intelligence * 3
  
    if (notFullSpirit)
      probability += intelligence * 3

    if(hasRetreatOpportunityFromInFront)
      probability += intelligence * 3
    if(hasRetreatOpportunityFromBehind)
      probability += intelligence * 3
  }


  function inFrontNearAndBehindFar(){
    //console.log('inFrontNearAndBehindFar');
    if (lowStamina)
      probability += 4 + intelligence * 2
  
    if (lowSpirit)
      probability += 4 + intelligence * 2

    if (notFullStamina)
      probability += intelligence * 2
  
    if (notFullSpirit)
      probability += intelligence * 2

    if(hasRetreatOpportunityFromInFront)
      probability += 2 + intelligence * 2
    if(hasRetreatOpportunityFromBehind)
      probability += intelligence * 2
    if(inFrontOnRampage)
      probability -= intelligence * 2
    if(behindOnRampage)
      probability -= intelligence * 2
  }


  function inFrontCloseAndBehindFar(){
    //console.log('inFrontCloseAndBehindFar');
    if (lowStamina)
      probability += intelligence * 2
  
    if (lowSpirit)
      probability += intelligence * 2
      
    if (notFullStamina)
      probability += intelligence

    if (notFullSpirit)
      probability += intelligence

    if(inFrontOnRampage)
      probability -= intelligence * 2
    if(behindOnRampage)
      probability -= intelligence    
  }  


  function inFrontFarAndBehindNear(){
    //console.log('inFrontFarAndBehindNear');

    if (lowStamina)
      probability += 2
  
    if (lowSpirit)
      probability += 2

    
    if(hasRetreatOpportunityFromBehind){   
      const enemySpeed = enemyBehind.fighting.stats.speed
      const {fitness} = fighting.stats

      if(enemySpeed < 5 && fitness > 5){
        if(lowStamina)
          probability += intelligence
  
        if (lowSpirit)
          probability += intelligence
      }
      
    } else {
      probability -= intelligence * 4
    }

    if(inFrontOnRampage)
      probability -= 2 + intelligence
    if(behindOnRampage)
      probability -= intelligence * 2
    
  }
  function inFrontNearAndBehindNear(){
    //console.log('inFrontNearAndBehindNear');
    probability -= intelligence * 2
    if (lowStamina)
      probability += 2
    if (lowSpirit)
      probability += 2

    if(!hasRetreatOpportunityFromInFront){
      probability -= intelligence * 2
    }

    if(!hasRetreatOpportunityFromBehind){   
      probability -= intelligence * 2
    }
  

    if(
      !hasRetreatOpportunityFromInFront && 
      !hasRetreatOpportunityFromBehind
    ){
      probability -= intelligence * 2
    }

    if(
      hasRetreatOpportunityFromInFront && 
      hasRetreatOpportunityFromBehind
    ){
      const enemySpeed = enemyBehind.fighting.movement.moveSpeed
      const {fitness} = fighting.stats

      if(enemySpeed > 60 && fitness > 5){
        if(lowStamina)
          probability += intelligence
  
        if (lowSpirit)
          probability += intelligence
      }
    }


    if(inFrontOnRampage)
      probability -= intelligence * 2
    if(behindOnRampage)
      probability -= intelligence * 2
    
  }
  function inFrontCloseAndBehindNear(){
    //console.log('inFrontCloseAndBehindNear');
    probability -= 4 + intelligence * 2

    if(!hasRetreatOpportunityFromInFront){
      probability -= intelligence * 2
    }

    if(!hasRetreatOpportunityFromBehind){   
      probability -= intelligence * 2
    }
  

    if(
      !hasRetreatOpportunityFromInFront && 
      !hasRetreatOpportunityFromBehind
    ){
      probability -= intelligence * 2
    }


    if(inFrontOnRampage)
      probability -= intelligence * 2
    if(behindOnRampage)
      probability -= intelligence * 2
  }


  function inFrontFarAndBehindClose(){
    //console.log('inFrontFarAndBehindClose');
    probability -= 4 + intelligence * 3

    if (lowStamina)
      probability += 2
  
    if (lowSpirit)
      probability += 2


    if(!hasRetreatOpportunityFromInFront)
      probability -= intelligence

    if(!hasRetreatOpportunityFromBehind)
      probability -= intelligence * 2
  

    if(
      !hasRetreatOpportunityFromInFront && 
      !hasRetreatOpportunityFromBehind
    ){
      probability -= intelligence * 2
    }
    
  }
  function inFrontNearAndBehindClose(){
    //console.log('inFrontNearAndBehindClose');
    
    probability -= 4 + intelligence * 3


    if(!hasRetreatOpportunityFromInFront)
      probability -= intelligence * 2

    if(!hasRetreatOpportunityFromBehind)
      probability -= intelligence * 2
  

    if(
      !hasRetreatOpportunityFromInFront && 
      !hasRetreatOpportunityFromBehind
    ){
      probability -= intelligence * 2
    }
    
  }
  function inFrontCloseAndBehindClose(){
    //console.log('inFrontCloseAndBehindClose');

    probability -= 6 + intelligence * 4


    if(!hasRetreatOpportunityFromInFront)
      probability -= 2 + intelligence * 2

    if(!hasRetreatOpportunityFromBehind)
      probability -= intelligence * 2
  

    if(
      !hasRetreatOpportunityFromInFront && 
      !hasRetreatOpportunityFromBehind
    ){
      probability -= intelligence * 2
    }
    
  }


  function inFrontFar(){
    //console.log('inFrontFar');
    probability += (10 - energy)
    probability += 6 + intelligence * 3
    if (lowStamina)
      probability += 6 + intelligence * 3

    if (lowSpirit)
      probability += 6 + intelligence * 3

    if (notFullStamina)
      probability += intelligence * 4

    if (notFullSpirit)
      probability += intelligence * 4

    if(hasRetreatOpportunityFromInFront)
      probability += intelligence * 3
    
  }
  function inFrontNear(){
    //console.log('inFrontNear');
    if (lowStamina)
      probability += 6 + intelligence * 2

    if (lowSpirit)
      probability += 6 + intelligence * 2


    if(hasRetreatOpportunityFromInFront){
      if (notFullStamina)
        probability += intelligence * 2
  
      if (notFullSpirit)
        probability += intelligence * 2
    }
    
  }
  function inFrontClose(){
    //console.log('inFrontClose');
    probability -= intelligence * 2
    if (lowStamina)
      probability += 2
    if (lowSpirit)
      probability += 2

    if(!hasRetreatOpportunityFromInFront){
      probability -= intelligence * 2
    }
    
  }

  function behindFar(){
    //console.log('behindFar');
    probability += (10-energy)
    probability += 2 + intelligence * 4
    if (lowStamina)
      probability += 2 + intelligence * 4
    if (lowSpirit)
      probability += 2 + intelligence * 4

    if(hasRetreatOpportunityFromBehind){
      if (notFullStamina)
        probability += intelligence * 3
  
      if (notFullSpirit)
        probability += intelligence * 3
    }
    
  }
  function behindNear(){
    //console.log('behindNear');
    probability -= 2 + intelligence
    if (lowStamina)
      probability -= 2 + intelligence
    if (lowSpirit)
      probability -= 2 + intelligence

    if(hasRetreatOpportunityFromBehind){
      if (lowStamina)
        probability += 2
  
      if (lowSpirit)
        probability += 2
    }
    else {
      probability -= intelligence * 2
      if (!lowStamina)
        probability -= intelligence * 2
  
      if (!lowSpirit)
        probability -= intelligence * 2
    }
    
  }
  function behindClose(){
    //console.log('behindClose');
    probability -= 6 + intelligence * 4
    
    if(!hasRetreatOpportunityFromBehind){
      probability -= 2 + intelligence * 4
    }
  }

  
  function inFrontFarAndDontKnowBehind(){
    //console.log('inFrontFarAndDontKnowBehind');
    probability += 6 - intelligence * 4
    if (lowStamina)
      probability += 6 - intelligence * 4

    if (lowSpirit)
      probability += 6 - intelligence * 4

    if (notFullStamina)
      probability += 2 - intelligence * 4

    if (notFullSpirit)
      probability += 2 - intelligence * 4

    if(hasRetreatOpportunityFromInFront)
      probability += 2 - intelligence * 4
    else
      probability -= intelligence * 4

      
    if(inFrontOnRampage)
      probability -= intelligence
    
  }
  function inFrontNearAndDontKnowBehind(){
    //console.log('inFrontNearAndDontKnowBehind');
    probability += 4 - intelligence * 5
    if (lowStamina)
      probability += 4 - intelligence * 5

    if (lowSpirit)
      probability += 4 - intelligence * 5


    if(hasRetreatOpportunityFromInFront)
      probability += 2 - intelligence * 5
    else
      probability -= intelligence * 5

    if(inFrontOnRampage)
      probability -= intelligence * 5
    
  }
  function inFrontCloseAndDontKnowBehind(){
    //console.log('inFrontCloseAndDontKnowBehind');
    probability -= 4 + intelligence * 8
    if(inFrontOnRampage)
      probability -= intelligence * 6
    
  }
  function inFrontStrikingAndDontKnowBehind(){
    //console.log('inFrontStrikingAndDontKnowBehind')
    probability -= 4 + intelligence * 10
  }

  function inFrontStriking(){
    //console.log('inFrontStriking')
    probability -= 6
  }
  function inFrontStrikingAndBehindFar(){
    //console.log('inFrontStrikingAndBehindFar')
    probability -= 7 + intelligence * 2
  }
  function inFrontStrikingAndBehindNear(){
    //console.log('inFrontStrikingAndBehindNear')
    probability -= 8 + intelligence * 4
  }
  function inFrontStrikingAndBehindClose(){
    //console.log('inFrontStrikingAndBehindClose')
    probability -= 9 + intelligence * 6
  }

  function behindStriking(){
    //console.log('behindStriking')
    probability -= 5 + intelligence
  }
  function inFrontFarAndBehindStriking(){
    //console.log('inFrontFarAndBehindStriking')
    probability -= 6 + intelligence * 6
  }
  function inFrontNearAndBehindStriking(){
    //console.log('inFrontNearAndBehindStriking')
    probability -= 7 + intelligence * 6
  }
  function inFrontCloseAndBehindStriking(){
    //console.log('inFrontCloseAndBehindStriking')
    probability -= 8 + intelligence * 6
  }

  function inFrontStrikingAndBehindStriking(){
    //console.log('inFrontStrikingAndBehindStriking')
    probability -= 10 + intelligence * 10
  }
  
}
