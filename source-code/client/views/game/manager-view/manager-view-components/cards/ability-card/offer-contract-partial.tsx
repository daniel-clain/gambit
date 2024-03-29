import React, { useEffect, useState } from "react"
import { AbilityData } from "../../../../../../../game-components/abilities-general/ability"
import { ManagerInfo } from "../../../../../../../game-components/manager"
import { ContractOffer, GoalContract } from "../../../../../../../interfaces/game/contract.interface"
import { JobSeeker } from "../../../../../../../interfaces/front-end-state-interface"
import { InfoBox } from "../../partials/info-box/info-box"
import { ifTargetIsFighter } from "../../../../../../front-end-service/ability-service-client"

type OfferContractPartialProps = {
  activeAbility: AbilityData,
  setActiveAbility(activeAbility: AbilityData)
  jobSeekers: JobSeeker[] 
  managerInfo: ManagerInfo
}

export const OfferContractPartial = ({activeAbility, setActiveAbility, jobSeekers, managerInfo}: OfferContractPartialProps) => {
    const {target, source} = activeAbility

    if(!target) return <></>
    

    const goalContract = (
      target.characterType == 'Fighter' && target.goalContract ||
      jobSeekers.find(jobSeeker => jobSeeker.name == target.name)!.goalContract
    )
   

    useEffect(() => {
      if(!activeAbility.additionalData){
        setContractOffer(goalContract.weeklyCost)
      }
    })

    if(!activeAbility.additionalData) return <></>

    let moneyOfferVal = activeAbility.additionalData.contractOffer.weeklyCost


    
    return <>
      <InfoBox 
        heading={'Contract Offer'}
        list={[                  
          {label: 'Goal money per week', value: goalContract.weeklyCost},
          {label: 'Number of weeks', value: goalContract.numberOfWeeks},
          {label: 'Your money offer per week', value: 
            <input className='money-offer' type="number" value={moneyOfferVal} onChange={({target:{value}}:any) => setContractOffer(parseInt(value))} onKeyPress={handleEnterEvent}/>
          }
        ]}
      />
    </>
    function setContractOffer(weeklyCost){
      setActiveAbility({...activeAbility, additionalData: {contractOffer: {
        numberOfWeeks: goalContract.numberOfWeeks,
        weeklyCost
      }}})
    }
    function handleEnterEvent(event){
      if(event.key == 'Enter')
        event.target.blur()
    }
  }
