import * as React from 'react';
import { useEffect, useState } from 'react';
import { octagon } from '../../../../../../game-components/fight/octagon';
import Coords from '../../../../../../interfaces/game/fighter/coords';
import { FighterComponent } from '../fighter/fighter.component';

export const ArenaUi = ({fighterFightStates}) => {
	const cornerPoints: Coords[] = Object.values(octagon.points)
	const [arenaWidth, setArenaWidth] = useState<number>()
	useEffect(() => {
		setArenaWidth(getArenaWidth())
		window.addEventListener('resize', 
			() => setArenaWidth(getArenaWidth())
		)
		function getArenaWidth(){
			return document.querySelector('.octagon')!.clientWidth
		}
	
	})

	
	return <div className='arena-ui'>
		{arenaWidth}
		<div className="background-top"></div>
		<div className="octagon">
			{cornerPoints.map((point: Coords, index) =>
				<div className="point" key={Math.round(point.x + point.y)} style={{ left: point.x, bottom: point.y }}></div>
			)}
			
			<div className="fighters">
        {fighterFightStates?.map((fighter, i) => 
          <FighterComponent key={i} fighterFightState={fighter} arenaWidth={arenaWidth}/>
        )}
			</div>	
		</div>		
		<div className="background-bottom"></div>
	</div>


}
