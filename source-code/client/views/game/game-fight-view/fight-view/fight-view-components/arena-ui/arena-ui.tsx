import { Dispatch, PropsWithChildren, useLayoutEffect } from "react"
import { octagon } from "../../../../../../../game-components/fight/octagon"
import Coords from "../../../../../../../interfaces/game/fighter/coords"

type Props = {
  arenaWidth: number | undefined
  setArenaWidth: Dispatch<React.SetStateAction<number | undefined>>
}
export const ArenaUi = ({
  setArenaWidth,
  children,
}: PropsWithChildren<Props>) => {
  const cornerPoints: Coords[] = Object.values(octagon.points)
  useLayoutEffect(() => {
    setArenaWidth(getArenaWidth())
    window.onresize = () => setArenaWidth(getArenaWidth())

    function getArenaWidth() {
      return document.querySelector(".octagon")!.clientWidth
    }
  })

  return (
    <div className="arena-ui">
      <div className="background-top"></div>
      <div className="octagon">
        {false ? (
          <point-markers>
            {cornerPoints.map((point: Coords) => (
              <div
                className="point"
                key={Math.round(point.x + point.y)}
                style={{ left: point.x, bottom: point.y }}
              />
            ))}
          </point-markers>
        ) : (
          ""
        )}
        {children}
      </div>
      <div className="background-bottom"></div>
    </div>
  )
}
