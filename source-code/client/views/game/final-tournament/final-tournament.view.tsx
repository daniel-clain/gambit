import { toCamelCase } from "../../../../helper-functions/helper-functions"
import { TournamentState } from "../../../../interfaces/front-end-state-interface"
import { Fight_View } from "../game-fight-view/fight-view/fight.view"
import "./final-tournament.scss"

export const FinalTournament_View = ({
  finalTournamentState,
  isDisplay,
}: {
  finalTournamentState: TournamentState
  isDisplay: boolean
}) => {
  const { finalTournamentBoard, fightUiState } = finalTournamentState
  const { finals, semiFinals, quarterFinals, showTournamentBoard } =
    finalTournamentBoard
  return (
    <div id="final-tournament">
      {showTournamentBoard && (
        <div className="final-tournament-board-container">
          <div className="final-tournament-board">
            {finals.winner ? (
              <div className="tournament-winner">
                Winner <br />
                {finals.winner?.name}!
              </div>
            ) : (
              ""
            )}
            <div className="fighter-name finalist fighter1">
              {finals.fighter1?.name}
            </div>
            <div className="fighter-name finalist fighter2">
              {finals.fighter2?.name}
            </div>

            {semiFinals?.map((semiFinal) => [
              <div
                key={`fighter1-${semiFinal.matchupName}`}
                className={`fighter-name ${toCamelCase(
                  semiFinal.matchupName
                )} fighter1`}
              >
                {semiFinal.fighter1?.name}
              </div>,
              <div
                key={`fighter2-${semiFinal.matchupName}`}
                className={`fighter-name ${toCamelCase(
                  semiFinal.matchupName
                )} fighter2`}
              >
                {semiFinal.fighter2?.name}
              </div>,
            ])}

            {quarterFinals.map((quarterFinal) => [
              <div
                key={`fighter1-${quarterFinal.matchupName}`}
                className={`fighter-name ${toCamelCase(
                  quarterFinal.matchupName
                )} fighter1`}
              >
                {quarterFinal.fighter1?.name}
              </div>,
              <div
                key={`fighter2-${quarterFinal.matchupName}`}
                className={`fighter-name ${toCamelCase(
                  quarterFinal.matchupName
                )} fighter2`}
              >
                {quarterFinal.fighter2?.name}
              </div>,
            ])}
          </div>
        </div>
      )}
      {!showTournamentBoard && fightUiState && (
        <Fight_View {...{ fightUiState, isDisplay }} />
      )}
    </div>
  )
}
