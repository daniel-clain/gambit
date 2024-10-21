const groups = ['energy', 'movement', 'retreat', 'attack'] as const
type Group = typeof groups[number]
type Note = [string, Group[]]

export const notes: Note[] = [
  ['desperate retreat cant trigger if low energy', ['energy', 'retreat']],
  ['decided move action will persist diminishing over 3 seconds', ['movement']],
  ['attacking uses energy, attack slower when low energy', ['attack', 'energy']]
]