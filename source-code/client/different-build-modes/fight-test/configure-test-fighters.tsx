import { useEffect, useState } from "react"
import Fighter from "../../../game-components/fighter/fighter"

import "./configure-test-fighters.scss"
type Props = {
  onFightersUpdated: (fighters: Fighter[]) => void
}
export const ConfigureTestFighters = ({ onFightersUpdated }: Props) => {
  const [fighters, setFighters] = useState<Fighter[]>([])
  const emptyFighter = {
    name: "",
    strength: "",
    fitness: "",
    intelligence: "",
    aggression: "",
  }
  const [newFighter, setNewFighter] = useState(emptyFighter)
  const [configOpen, setConfigOpen] = useState(false)

  const add = (f: Fighter) => setFighters([...fighters, f])
  const update = (f: Fighter) =>
    setFighters([...fighters.map((x) => (f.name != x.name ? x : f))])
  const del = (name: string) =>
    setFighters([...fighters.filter((x) => name != x.name)])

  useEffect(() => {
    onFightersUpdated(fighters)
  }, [fighters])

  const fighterItem = (existingFighter?: Fighter) => {
    existingFighter && console.log(existingFighter)
    let fighter = existingFighter || newFighter

    const setStat = (e: any) => {
      e.stopPropagation()
      const {
        target: { name, value },
      } = e
      if (existingFighter) {
        const updated = { ...existingFighter }
        updated[name] = value
        update({ ...updated })
      } else {
        const updated = { ...newFighter }
        updated[name] = value
        setNewFighter({ ...updated })
      }
    }
    const reset = () => {
      setNewFighter(emptyFighter)
    }

    return (
      <div
        className={`fighter-config ${existingFighter ? "existing" : "new"}`}
        key={existingFighter?.name || "new"}
      >
        <div className="stat">
          name:{" "}
          <input
            name="name"
            onChange={setStat}
            value={fighter?.name}
            disabled={!!existingFighter}
          />
        </div>
        <div className="stat">
          strength:{" "}
          <input name="strength" onChange={setStat} value={fighter?.strength} />
        </div>
        <div className="stat">
          fitness:{" "}
          <input name="fitness" onChange={setStat} value={fighter?.fitness} />
        </div>
        <div className="stat">
          intelligence:{" "}
          <input
            name="intelligence"
            onChange={setStat}
            value={fighter?.intelligence}
          />
        </div>
        <div className="stat">
          aggression:{" "}
          <input
            name="aggression"
            onChange={setStat}
            value={fighter?.aggression}
          />
        </div>

        {existingFighter ? (
          [
            <button onClick={() => update(fighter)}>Update</button>,
            <button onClick={() => del(fighter.name)}>Delete</button>,
          ]
        ) : (
          <button onClick={() => (add(fighter), reset())}>Add</button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={`fighter-stats-drawer ${configOpen ? "is-open" : ""}`}>
        <div
          className="open-close-tag"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setConfigOpen(!configOpen)
          }}
        >
          {configOpen ? "Close" : "Open"} config
        </div>
        {fighterItem()}
        {fighters.map(fighterItem)}
      </div>
    </>
  )
}
