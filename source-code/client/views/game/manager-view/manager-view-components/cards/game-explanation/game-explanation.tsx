
import * as React from 'react'
import { Modal } from '../../partials/modal/modal'
import { observer } from 'mobx-react'

type Topic = {
  name: string
  details: string | string[]
  subTopics?: Topic[]
}

export const GameExplanationCard = observer(() => {

  const explanation: {topics: Topic[]} = {
    topics: [
      {name: 'Employees', 
        details: [
          'Each employee has 1 action point to use per week'
        ] satisfies string[]
      }
    ]
  }

  return (
    <Modal>
      <div className='card game-explanation-card'>
        <div className='heading'>Game Explanation</div>
        <div className="card__two-columns">

        </div>
      </div>
    </Modal>
  )

})