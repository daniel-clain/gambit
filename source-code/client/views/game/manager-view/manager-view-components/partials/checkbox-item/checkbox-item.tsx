
import * as React from 'react';
import './checkbox-item.scss'
type CheckboxItemProps = {
  selected: boolean
  onSelected: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  children
}
export const CheckboxItem = ({selected, onSelected, children}: CheckboxItemProps) => {

  return <>
    <div className="checkbox-item" onClick={onSelected}>
      <div className={`checkbox ${selected ? 'is-checked':''}`}></div>
      <div className="checkbox-label">{children}</div>
    </div>
  </>
}