import Coords from "../interfaces/game/fighter/coords";
import Direction360 from "../types/figher/direction-360";

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



