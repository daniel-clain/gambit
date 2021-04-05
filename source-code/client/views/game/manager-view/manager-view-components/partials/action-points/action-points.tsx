import * as React from 'react';
import './action-points.scss'
export default function ActionPoints({actionPoints}: {actionPoints: number}){
  return <span className='action-points'>{actionPoints}</span>
}