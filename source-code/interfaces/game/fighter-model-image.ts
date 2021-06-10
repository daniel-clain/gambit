import Dimensions from "./fighter/dimensions";
import FighterModelState from "../../types/fighter/fighter-model-states";

export default interface IFighterModelImage {  
	modelState: FighterModelState
	dimensions: Dimensions
	imageName: string
}
