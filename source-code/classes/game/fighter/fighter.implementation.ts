import { Observable } from "rxjs";

const fighterImplementationCode = fighter => {
  return {
    isFighting: () => {
      return new Observable(subscriber => {
        fighter._isFighting
      })
    }
  }
}


export default fighterImplementationCode