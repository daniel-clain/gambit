import * as React from 'react'
import { PostFightReportData } from '../../../../interfaces/front-end-state-interface'
import './post-fight-report.scss'


export interface PostFightReportProps{
  postFightReportData: PostFightReportData
}

export class PreFightNews extends React.Component<PostFightReportProps>{

  

  render(){
    const {notifications} = this.props.postFightReportData
    const employeesHired = notifications.filter(notification => notification.type == 'employee hired')
    const employeesOutcomes = notifications.filter(notification => notification.type == 'employee outcome')
    const fightBetResults = notifications.filter(notification => notification.type == 'fight bet result')

    return (
      <div className="post-fight-report">
        {fightBetResults && 
          <div className="fight-bet-results">
            <h1>Fight Bet Results</h1>
            <ul>
              {employeesHired.map(notification => 
                <li>{notification.message}</li>
              )}
            </ul>
          </div>
        }
        {employeesHired && 
          <div className="employees-hired">
            <h1>Employees Hired</h1>
            <ul>
              {employeesHired.map(notification => 
                <li>{notification.message}</li>
              )}
            </ul>
          </div>
        }
        {employeesOutcomes && 
          <div className="employees-hired">
            <h1>Employee Outomes</h1>
            <ul>
              {employeesOutcomes.map(notification => 
                <li>{notification.message}</li>
              )}
            </ul>
          </div>
        }
      </div>
    )
  }
};
