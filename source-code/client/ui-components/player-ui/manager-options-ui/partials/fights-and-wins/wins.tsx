import * as React from 'react';
import './fights-and-wins.scss'
export default function Wins({numberOfWins}: {numberOfWins: number | string}){
  return (  
    <span className='wins'>
      <span className='icon'>Wins</span>{numberOfWins}
    </span>
  )
}