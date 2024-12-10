import "./fights-and-wins.scss"
export default function Wins({
  numberOfWins,
}: {
  numberOfWins: number | undefined
}) {
  return (
    <div className="wins">
      <span className="icon">Wins</span>
      {numberOfWins ?? "?"}
    </div>
  )
}
