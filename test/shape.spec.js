import render from 'react-test-renderer'
import ShapeRect from '../app/js/components/canvas/shape.rect'

describe('Shape', () => {
  it('should render a rectangle', () => {
    const shapeJson = {
      width: 2, height: 2, x: 1, y: 1, r: 0, fill: '#00f', stroke: '#00f',
      fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1
    }

    const element = render(
      <ShapeRect
        dpi={72}
        zoom={1}
        shape={shapeJson}
        selectable={false}
      />)

    expect(true).to.be.true
  })
})