import FighterTimers from "../game-components/fighter/fighter-fighting/fighter-timers";

import FighterFighting from "../game-components/fighter/fighter-fighting/fighter-fighting";

const timer = new FighterTimers({fighter: {name: 'Bob'}} as FighterFighting)

timer.startTimer(timer.memoryOfEnemyBehind)