import Dimensions from "./fighter/dimensions";
import FighterModelState from "../../types/figher/fighter-model-states";

export default interface IFighterModelImage {  
	modelState: FighterModelState
	dimensions: Dimensions
	imageName: string
}
