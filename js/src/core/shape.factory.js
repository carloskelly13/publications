export default class ShapeFactory {
  static rectangle() {
    return { 
      type: 'rect', 
      x: 0.25, 
      y: 0.25, 
      r: 0, 
      angle: 0, 
      width: 1, 
      height: 1, 
      fill: '#609eeb', 
      stroke: '#4e8bda', 
      strokeWidth: 1, 
      strokeOpacity: 1.0, 
      fillOpacity: 1.0 
    };
  }
  
  static ellipse() {
    return { 
      type: 'ellipse', 
      x: 1.25, 
      y: 1.25, 
      r: 0, 
      angle: 0, 
      width: 1, 
      height: 1, 
      fill: '#609eeb', 
      stroke: '#4e8bda', 
      strokeWidth: 1, 
      strokeOpacity: 1.0, 
      fillOpacity: 1.0 
    };
  }
}