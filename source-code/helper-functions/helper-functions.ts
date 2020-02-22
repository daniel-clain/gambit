import Coords from "../interfaces/game/fighter/coords";
import Direction360 from "../types/figher/direction-360";
import { FighterInfo, KnownFighter, KnownFighterStats } from "../interfaces/game-ui-state.interface";

export function random(number: number, startAtOne?: boolean){return Math.round((Math.random() * (number + (startAtOne ? -1 : 0))) + (startAtOne ? 1 : 0))}

export const shuffle = <T>(array: T[]): T[] => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const wait = (milliseconds: number): Promise<void> => new Promise(resolve => setTimeout(resolve, milliseconds))

export const getDistanceBetweenTwoPoints = (point1: Coords, point2: Coords): number =>{
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + 
    Math.pow(point1.y - point2.y, 2)
  )
}

export function getPointGivenDistanceAndDirectionFromOtherPoint(point: Coords, distance: number, direction: Direction360): Coords{
  const hypotenuse = distance
  let {x, y} = point

  if(direction < 90){
    const angle = direction - 0
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x += Math.round(sinAngle * hypotenuse)
    y += Math.round(cosAngle * hypotenuse)
  }
  else if(direction < 180){
    const angle = direction - 90
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x += Math.round(cosAngle * hypotenuse)
    y -= Math.round(sinAngle * hypotenuse)
  }
  else if(direction < 270){
    const angle = direction - 180
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x -= Math.round(sinAngle * hypotenuse)
    y -= Math.round(cosAngle * hypotenuse)
  }
  else if(direction < 360){
    const angle = direction - 270
    const sinAngle = Math.sin(angle * (Math.PI/180))
    const cosAngle = Math.cos(angle * (Math.PI/180))
    x -= Math.round(cosAngle * hypotenuse)
    y += Math.round(sinAngle * hypotenuse)

  }






  const sinAngle = Math.sin(direction * (Math.PI/180))
  const cosAngle = Math.cos(direction * (Math.PI/180))

  
  return {x, y}
}


export const getDirectionOfPosition2FromPosition1 = (pos1: Coords, pos2: Coords): Direction360 => {
  let directionOfPosition2FromPosition1: Direction360
  let xLength = pos2.x - pos1.x
  let yLength = pos2.y - pos1.y
  let adjacentSide
  let oppositeSide
  let addedDegrees
  if(xLength == 0 && yLength == 0)
    return 0
  if (xLength < 0 && yLength >= 0) {
    oppositeSide = yLength
    adjacentSide = xLength * -1
    addedDegrees = 270
  }
  if (xLength < 0 && yLength < 0) {
    adjacentSide = yLength * -1
    oppositeSide = xLength * -1
    addedDegrees = 180
  }
  if (xLength >= 0 && yLength < 0) {
    oppositeSide = yLength * -1
    adjacentSide = xLength
    addedDegrees = 90
  }
  if (xLength >= 0 && yLength >= 0) {
    adjacentSide = yLength
    oppositeSide = xLength
    addedDegrees = 0
  }

  const degrees = Math.round(Math.atan(oppositeSide / adjacentSide) * (180 / Math.PI))
  directionOfPosition2FromPosition1 = degrees + addedDegrees

  if(isNaN(directionOfPosition2FromPosition1))
    debugger

  if(degrees + addedDegrees == 360){
    directionOfPosition2FromPosition1 = 0
  }

  return directionOfPosition2FromPosition1
}

export const convertFighterInfoToKnownFighter = (fighterInfo: FighterInfo): KnownFighter => {

  let knownStats = {} as KnownFighterStats

  for(let key in fighterInfo){
    if(key !== 'name' && key !== 'inNextFight')
      knownStats[key] = fighterInfo[key]
  }

  const knownFighter: KnownFighter = {
    name: fighterInfo.name,
    knownStats
  }

  return knownFighter
}



