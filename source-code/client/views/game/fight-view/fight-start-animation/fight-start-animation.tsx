import * as React from 'react';
import { useEffect, useState } from "react"
import { wait } from '../../../../../helper-functions/helper-functions';


type FightExplosionAnimationStages =
'start' |
'grow' |
'shrink-and-fade' |
'removed'


export const FightStartAnimation = ({doStartAnimation}) => {
  
  const doFightExplosionAnimation = async () =>{
    setFightExplosionAnimationStage('start')
    await wait(400)
    setFightExplosionAnimationStage('grow') 
    await wait(800)
    setFightExplosionAnimationStage('shrink-and-fade')
    await wait(400)
    setFightExplosionAnimationStage('removed')
  }

  useEffect(() => {
    doFightExplosionAnimation()
  }, [doStartAnimation])
    
  const [fightExplosionAnimationStage, setFightExplosionAnimationStage] = useState<FightExplosionAnimationStages>('removed')

  return <div className={`fight-explosion fight-explosion--${fightExplosionAnimationStage}`}></div>
}