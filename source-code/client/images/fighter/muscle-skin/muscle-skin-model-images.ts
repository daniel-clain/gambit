import FighterModelImage from "../../../../interfaces/game/fighter/fighter-model-image";

export const muscleSkinModelImages: FighterModelImage[] = [
	{
		modelState: 'Idle',
		dimensions: { width: 57, height: 94 },
		imageName: 'idle.png'
	},
	{
		modelState: 'Punching',
		dimensions: { width: 78, height: 94 },
		imageName: 'punching.png'
	},
	{
		modelState: 'Kicking',
		dimensions: { width: 86, height: 104 },
		imageName: 'kicking.png'
	},
	{
		modelState: 'Knocked Out',
		dimensions: { width: 82, height: 38 },
		imageName: 'knocked-out.png'
	},
	{
		modelState: 'Defending',
		dimensions: { width: 54, height: 94 },
		imageName: 'defending.png'
	},
	{
		modelState: 'Dodging',
		dimensions: { width: 54, height: 63 },
		imageName: 'dodging.png'
	},
	{
		modelState: 'Blocking',
		dimensions: { width: 59, height: 101 },
		imageName: 'blocking.png'
	},
	{
		modelState: 'Taking Hit',
		dimensions: { width: 56, height: 88 },
		imageName: 'taking-hit.png'
	},
	{
		modelState: 'Walking',
		dimensions: { width: 64, height: 98 },
		imageName: 'walking.png'
	},
	{
		modelState: 'Recovering',
		dimensions: { width: 57, height: 70 },
		imageName: 'recovering.png'
	},
	{
		modelState: 'Victory',
		dimensions: { width: 58, height: 139 },
		imageName: 'victory.png'
	}
]

