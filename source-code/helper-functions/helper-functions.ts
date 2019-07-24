import Position from "../interfaces/game/fighter/position";
import Direction360 from "../types/figher/direction-360";

export function random(number: number, startAtOne?: boolean){return Math.floor((Math.random() * (number + (startAtOne ? -1 : 0))) + (startAtOne ? 1 : 0))}
export function getDistanceBetweenTwoPositions(pos1: Position, pos2: Position){return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y  - pos2.y, 2))}
export function getDirectionOfPosition2FromPosition1(pos1: Position, pos2: Position){
  let directionOfPosition2FromPosition1: Direction360
  let xLength = pos1.x - pos2.x
  let yLength = pos1.y - pos2.y
  let adjacentSide
  let oppositeSide
  let addedDegrees
  if (xLength < 0 && yLength > 0) {
    oppositeSide = yLength
    adjacentSide = xLength * -1
    addedDegrees = 270
  }
  if (xLength < 0 && yLength < 0) {
    adjacentSide = yLength * -1
    oppositeSide = xLength * -1
    addedDegrees = 180
  }
  if (xLength > 0 && yLength < 0) {
    oppositeSide = yLength * -1
    adjacentSide = xLength
    addedDegrees = 90
  }
  if (xLength > 0 && yLength > 0) {
    adjacentSide = yLength
    oppositeSide = xLength
    addedDegrees = 0
  }

  const degrees = Math.round(Math.atan(oppositeSide / adjacentSide) * (180 / Math.PI))
  directionOfPosition2FromPosition1 = degrees + addedDegrees

  return directionOfPosition2FromPosition1
}
export function shuffle<T>(array: T[]): T[] {
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
