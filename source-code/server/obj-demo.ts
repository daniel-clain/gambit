const fighters = ["fred", "dave"]

function RoundController(game){
  return {
      nextFight: null,
      startRound(num){
          console.log('starting round',num)
          this.nextFight = {
              fighters: game.has.fighters
          }
      }
  }
}

const game = {
  fighters,
  roundController: RoundController(this)
}