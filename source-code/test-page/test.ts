import { getPointGivenDistanceAndDirectionFromOtherPoint } from "../helper-functions/helper-functions";
import Coords from "../interfaces/game/fighter/coords";

const coord: Coords = getPointGivenDistanceAndDirectionFromOtherPoint({x:200, y:200}, 100, 280)


console.log('coord :', coord);