import FighterModelImage from "../../../../interfaces/game/fighter/fighter-model-image";

export const fastSkinModelImages: FighterModelImage[] = [
	{
		modelState: 'Idle',
		dimensions: { width: 48, height: 82 },
		imageName: 'idle.png'
	},
	{
		modelState: 'Punching',
		dimensions: { width: 73, height: 82 },
		imageName: 'punching.png'
	},
	{
		modelState: 'Kicking',
		dimensions: { width: 73, height: 92 },
		imageName: 'kicking.png'
	},
	{
		modelState: 'Knocked Out',
		dimensions: { width: 83, height: 30 },
		imageName: 'knocked-out.png'
	},
	{
		modelState: 'Defending',
		dimensions: { width: 48, height: 81 },
		imageName: 'defending.png'
	},
	{
		modelState: 'Dodging',
		dimensions: { width: 51, height: 72 },
		imageName: 'dodging.png'
	},
	{
		modelState: 'Blocking',
		dimensions: { width: 65, height: 74 },
		imageName: 'blocking.png'
	},
	{
		modelState: 'Taking Hit',
		dimensions: { width: 43, height: 75 },
		imageName: 'taking-hit.png'
	},
	{
		modelState: 'Walking',
		dimensions: { width: 47, height: 84 },
		imageName: 'walking.png'
	},
	{
		modelState: 'Recovering',
		dimensions: { width: 44, height: 59 },
		imageName: 'recovering.png'
	},
	{
		modelState: 'Victory',
		dimensions: { width: 49, height: 126 },
		imageName: 'victory.png'
	}
]

