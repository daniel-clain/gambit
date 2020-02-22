import Game from "../game";
import { Professional } from "../../interfaces/game-ui-state.interface";

export function doEndOfRoundReset(game: Game) {
  returnProfessionalJobSeekersToProfessionalsPool(game)
  game.roundController.jobSeekers = []
  resetFighterAffects(game)
};

function returnProfessionalJobSeekersToProfessionalsPool(game: Game){
  game.professionals.push(...game.roundController.jobSeekers
  .filter(jobSeeker => jobSeeker.type == 'Professional')
  .map((jobSeeker): Professional => {
    const {name, profession, skillLevel, abilities} = jobSeeker
    return {name, profession, skillLevel, abilities}
  }))

  game.fighters.forEach(fighter => fighter.state.goalContract = null)
}

function resetFighterAffects(game: Game) {
  game.fighters.forEach(fighter => {
    fighter.state.guards = []
    fighter.state.injured = false
    fighter.state.doping = false
    fighter.state.poisoned = false
  })
}

