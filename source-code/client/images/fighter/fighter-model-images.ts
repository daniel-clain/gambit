import FighterModelImage from "../../../interfaces/game/fighter/fighter-model-image";


export const fighterModelImages: FighterModelImage[] = [
	{
		modelState: 'Active',
		dimensions: { width: 41, height: 93 },
		imageName: 'images/walking.png'
	},
	{
		modelState: 'Idle',
		dimensions: { width: 41, height: 93 },
		imageName: 'images/walking.png'
	},
	{
		modelState: 'Punching',
		dimensions: { width: 63, height: 79 },
		imageName: 'punch.png'
	},
	{
		modelState: 'Kicking',
		dimensions: { width: 87, height: 86 },
		imageName: 'kick.png'
	},
	{
		modelState: 'Knocked Out',
		dimensions: { width: 80, height: 40 },
		imageName: 'down-and-out.png'
	},
	{
		modelState: 'Defending',
		dimensions: { width: 58, height: 92 },
		imageName: 'images/defending.png'
	},
	{
		modelState: 'Dodging',
		dimensions: { width: 49, height: 79 },
		imageName: 'dodge.png'
	},
	{
		modelState: 'Blocking',
		dimensions: { width: 53, height: 74 },
		imageName: 'block.png'
	},
	{
		modelState: 'Taking Hit',
		dimensions: { width: 56, height: 83 },
		imageName: 'take-hit.png'
	},
	{
		modelState: 'Walking',
		dimensions: { width: 41, height: 93 },
		imageName: 'walking.png'
	},
	{
		modelState: 'Recovering',
		dimensions: { width: 45, height: 67 },
		imageName: 'recover.png'
	}
]

