const punchFile = require('./punch.mp3')
const criticalStrikeFile = require('./critical-strike.mp3')
const dodgeFile = require('./dodge.mp3')
const blockFile = require('./block.mp3')
const outOfTimeFile = require('./out-of-time.mp3')
const fight = require('./fight.mp3')
export const punchSound = new Audio(punchFile.default)
export const criticalStrikeSound = new Audio(criticalStrikeFile.default)
export const dodgeSound = new Audio(dodgeFile.default)
export const blockSound = new Audio(blockFile.default)
export const outOfTimeSound = new Audio(outOfTimeFile.default)
export const fightSound = new Audio(fight.default)

punchSound.volume = 0.6
criticalStrikeSound.volume = 0.5
outOfTimeSound.volume = 0.4
