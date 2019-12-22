export default class Octagon {

  static points = {
    leftTop: {x: 11, y: 261},
    topLeft: {x: 243, y: 355},
    topRight: {x: 530, y: 355},
    rightTop: {x: 755, y: 265},
    rightBottom: {x: 782, y: 113},
    bottomRight: {x: 562, y: 0},
    bottomLeft: {x: 217, y: 0},
    leftBottom: {x: 0, y: 113}
  }
  private static edges = {
    left: {point1: Octagon.points.leftTop, point2: Octagon.points.leftBottom},
    topLeft: {point1: Octagon.points.leftTop, point2: Octagon.points.topLeft},
    top: {point1: Octagon.points.topLeft, point2: Octagon.points.topRight},
    topRight: {point1: Octagon.points.topRight, point2: Octagon.points.rightTop},
    right: {point1: Octagon.points.rightTop, point2: Octagon.points.rightBottom},
    bottomRight: {point1: Octagon.points.rightBottom, point2: Octagon.points.bottomRight},
    bottom: {point1: Octagon.points.bottomLeft, point2: Octagon.points.bottomRight},
    bottomLeft: {point1: Octagon.points.bottomLeft, point2: Octagon.points.leftBottom}
  }
  static checkIfPointIsWithinOctagon(point): boolean{
    for(let edgeKey in this.edges){
      if(!this.checkEdgeForPoint(edgeKey, this.edges[edgeKey], point)){
        return false
      }
    }
    return true
  }
  static balls(){
    return 'balls'
  }

  static getHeight(){
    let height
    for (const key in this.points) {
      const point = this.points[key]
      if(!(height > point.y))
        height = point.y
    }
    return height
  }
  static getWidth(){
    let width
    for (const key in this.points) {
      const point = this.points[key]
      if(!(width > point.x))
        width = point.x
    }
    return width
  }

  private static checkEdgeForPoint(edgeKey, edgePoints, testPoint): boolean{
    const {point1, point2} = edgePoints

    const m = (point1.y - point2.y) / (point1.x - point2.x)
    const b = point1.y - (m * point1.x)
    
    const yIfXPointWereOnTheLine = m * testPoint.x + b
    let test
    if(['bottomRight', 'bottom', 'bottomLeft'].some(keyName => keyName == edgeKey)){
      test = testPoint.y - yIfXPointWereOnTheLine
    }
    else {
      test = yIfXPointWereOnTheLine - testPoint.y
    }
    if(test > 0){
      return true
    }
    else{
      console.log(`${edgeKey}: **outside**`)
      return false
    }
  }
};
