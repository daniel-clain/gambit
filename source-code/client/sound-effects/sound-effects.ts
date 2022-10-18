const punchFile = require('url:./punch.mp3')
const criticalStrikeFile = require('url:./critical-strike.mp3')
const dodgeFile = require('url:./dodge.mp3')
const blockFile = require('url:./block.mp3')
const outOfTimeFile = require('url:./out-of-time.mp3')
const fight = require('url:./fight.mp3')

export const punchSound = new Audio(punchFile)
export const criticalStrikeSound = new Audio(criticalStrikeFile)
export const dodgeSound = new Audio(dodgeFile)
export const blockSound = new Audio(blockFile)
export const outOfTimeSound = new Audio(outOfTimeFile)
export const fightSound = new Audio(fight)
fightSound.volume = .5
punchSound.volume = 0.6
criticalStrikeSound.volume = 0.5
outOfTimeSound.volume = 0.4
