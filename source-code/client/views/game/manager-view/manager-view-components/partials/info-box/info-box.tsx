import { PropsWithChildren } from "react"
import { InfoBoxListItem } from "../../../../../../../interfaces/game/info-box-list"
import "./info-box.scss"

export interface InfoBoxProps {
  heading?: string
  info?: string
  list?: InfoBoxListItem[]
}

export const InfoBox = ({
  heading,
  info,
  list,
  children,
}: PropsWithChildren<InfoBoxProps>) => (
  <div className="info-box">
    <div className="info-box__heading">{heading}</div>
    <div className="info-box__content">
      {info && <div className="info">{info}</div>}
      {list && (
        <div className="grid">
          {list.map((listItem) => [
            <div key={listItem.label + "-label"} className="grid__label">
              {listItem.label}:
            </div>,
            <div key={listItem.label + "-value"} className="grid__value">
              {listItem.value}
            </div>,
          ])}
        </div>
      )}
      {children}
    </div>
  </div>
)
