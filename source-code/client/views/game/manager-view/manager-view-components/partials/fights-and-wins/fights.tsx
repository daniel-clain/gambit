import * as React from 'react';
import './fights-and-wins.scss'
export default function Fights({numberOfFights}: {numberOfFights: number | string}){
  return (    
    <div className='fights'>
      <span className='icon'>Fights</span>{numberOfFights}
    </div>
  )
}