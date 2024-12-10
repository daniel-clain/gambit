import "./fights-and-wins.scss"
export default function Fights({
  numberOfFights,
}: {
  numberOfFights: number | undefined
}) {
  return (
    <div className="fights">
      <span className="icon">Fights</span>
      {numberOfFights ?? "?"}
    </div>
  )
}
