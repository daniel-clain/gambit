import * as React from "react"
import { useEffect, useState } from "react"
import { hot } from "react-hot-loader/root"
import gameConfiguration from "../../../../../../game-settings/game-configuration"
import { wait } from "../../../../../../helper-functions/helper-functions"
import './money-rain.scss'

interface FallingMoney{
  falling: boolean,
  xVal: number
}

export const MoneyRain = hot(({money}: {money: number}) => {
  const [moneyFalling, setMoneyFalling] = useState<FallingMoney[]>([])

  if(money){

    const scrollUpDuration = 1
    const fallTime = 1
    const duration = gameConfiguration.stageDurations.showWinningsDuration - (scrollUpDuration + fallTime)
    const moneyDropTimeInterval = Math.round((duration / Math.ceil(money / 10)) * 1000)



    ;(async () => {
      if(!moneyFalling.length){
        await wait(scrollUpDuration * 1000)
      }
      await wait(moneyDropTimeInterval)

      if(moneyFalling.length != Math.ceil(money/10) ){
        setMoneyFalling([
          ...moneyFalling.map(m => ({...m, falling: true})), 
          {xVal: Math.round(Math.random() * 80 + 10), falling: false }
        ])
      } else if(!moneyFalling.every(m => m.falling)){
        setMoneyFalling([...moneyFalling.map(m => ({...m, falling: true}))])
      }
    })()
    
  }

  return <>
    <div className="money-container">
       {moneyFalling.map((coin, i) => 
        <div 
          key={i} 
          style={{left: `${coin.xVal}%`}}
          className={`coin ${coin.falling ? 'coin--falling' : ''}`}
        ></div>
      )} 
    </div>
  </>
})