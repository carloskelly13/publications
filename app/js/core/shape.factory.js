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

  static text() {
    return {
      type: 'text',
      x: 0.25,
      y: 0.25,
      r: 0,
      text: 'Double click to insert text',
      fontFamily: 'Source Sans Pro',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: '400',
      angle: 0,
      width: 2,
      height: 1,
      strokeWidth: 0,
      color: '#434a54',
      opacity: 1.0,
      textAlign: 'left'
    };
  }
}
