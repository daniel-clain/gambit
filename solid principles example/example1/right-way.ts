type Transportation = {
  travel(destination)
}

class Plane implements Transportation{
  travel(destination){this.getFlight(destination)}
}
class Train implements Transportation{
  travel(destination){this.catchTrain(destination)}
}
class Bike implements Transportation{
  travel(destination){this.rideBike(destination)}
}

class Person{
  
  travel(travelType: Transportation, destination){
    travelType.travel(destination)
  }

}

new Person.travel(new Bike(), destination)