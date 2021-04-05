import FlankingPair from "./flanking-pair";

export default interface Flanked{
  flankingPairs: FlankingPair[]
  criticality: number
}