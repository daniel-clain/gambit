type Sound = 'Punch' | 'Critical Strike' | 'Dodge' | 'Block'

export default interface SoundTime {
  soundName: Sound
  time: number
}