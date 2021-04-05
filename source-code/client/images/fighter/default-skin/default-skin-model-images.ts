import FighterModelImage from "../../../../interfaces/game/fighter/fighter-model-image";


export const defaultSkinModelImages: FighterModelImage[] = [
	{
		modelState: 'Idle',
		dimensions: { width: 41, height: 89 },
		imageName: 'walking.png'
	},
	{
		modelState: 'Punching',
		dimensions: { width: 65, height: 76 },
		imageName: 'punching.png'
	},
	{
		modelState: 'Kicking',
		dimensions: { width: 87, height: 78 },
		imageName: 'kicking.png'
	},
	{
		modelState: 'Knocked Out',
		dimensions: { width: 82, height: 25 },
		imageName: 'knocked-out.png'
	},
	{
		modelState: 'Defending',
		dimensions: { width: 50, height: 81 },
		imageName: 'defending.png'
	},
	{
		modelState: 'Dodging',
		dimensions: { width: 45, height: 71 },
		imageName: 'dodging.png'
	},
	{
		modelState: 'Blocking',
		dimensions: { width: 51, height: 77 },
		imageName: 'blocking.png'
	},
	{
		modelState: 'Taking Hit',
		dimensions: { width: 49, height: 76 },
		imageName: 'taking-hit.png'
	},
	{
		modelState: 'Walking',
		dimensions: { width: 41, height: 89 },
		imageName: 'walking.png'
	},
	{
		modelState: 'Recovering',
		dimensions: { width: 41, height: 61 },
		imageName: 'recovering.png'
	},
	{
		modelState: 'Victory',
		dimensions: { width: 51, height: 78 },
		imageName: 'victory.png'
	}
]

