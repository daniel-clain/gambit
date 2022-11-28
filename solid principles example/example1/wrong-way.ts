class Person{
  const pt = new PlaneTransportation()
  const tt = new TrainTransportation()
  const bt = new BikeTransportation()

  travel(travelType, destination){
    switch(travelType){
      case 'plane': this.pt.getFlight(destination)
      case 'train': this.tt.catchTrain(destination)
      case 'bike': this.bt.rideBike(destination)
      case 'taxi': this.xt.callTaxi(destination)
      case 'walk': this.wt.startWalking(destination)
    }
  }

}

new Person.travel('bike', destination)