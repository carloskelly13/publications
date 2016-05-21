import React, {Component, PropTypes} from 'react';

import InputColor from '../ui/input.color';
import InputText from '../ui/input.text';
import InputSelect from '../ui/input.select';
import {Typefaces} from '../../core/constants';

export default class InspectorShapeText extends Component {
  changeFontFormatting(event, name, value) {
    this.props.inputValueChanged({
      target: {name, value}
    });
  }

  render() {
    const {inputValueChanged, shape} = this.props

    return (
      <div className="inspector-content-section">
        <h1>Text</h1>
        <InputSelect
          displayName="Font Family"
          name="fontFamily"
          style="full"
          value={shape.fontFamily}
          options={Typefaces}
          onChange={inputValueChanged} />
        <InputText
          displayName="Font Size"
          name="fontSize"
          style="half left"
          type="number"
          unit="pt"
          validator='isInt'
          validatorOptions={{step: 1, min: 1, max: 512}}
          value={shape.fontSize}
          valueChanged={inputValueChanged} />
        <InputColor
          displayName="Color"
          name="color"
          style="half right"
          validator='isHexColor'
          value={shape.color}
          valueChanged={inputValueChanged} />
        <div className="segmented-control segmented-control-3">
          <div className="segmented-control-btn-container">
            <button className={shape.textAlign === 'left' ? 'active' : null} onClick={e => this.changeFontFormatting(e, 'textAlign', 'left')}>
              <span className={`icon icon-align-left ${shape.textAlign === 'left' ? 'active' : null}`}></span>
            </button>
            <button className={shape.textAlign === 'center' ? 'active' : null} onClick={e => this.changeFontFormatting(e, 'textAlign', 'center')}>
              <span className={`icon icon-align-center ${shape.textAlign === 'center' ? 'active' : null}`}></span>
            </button>
            <button className={shape.textAlign === 'right' ? 'active' : null} onClick={e => this.changeFontFormatting(e, 'textAlign', 'right')}>
              <span className={`icon icon-align-right ${shape.textAlign === 'right' ? 'active' : null}`}></span>
            </button>
          </div>
          <label>
            Alignment
          </label>
        </div>
        <div className="segmented-control segmented-control-3">
          <div className="segmented-control-btn-container">
            <button className={shape.fontWeight == 600 ? 'active' : null} onClick={e => this.changeFontFormatting(e, 'fontWeight', (shape.fontWeight == 600 ? 400 : 600))}>
              <span className={`icon icon-bold ${shape.fontWeight == 600 ? 'active' : null}`}></span>
            </button>
            <button className={shape.fontStyle === 'italic' ? 'active' : null} onClick={e => this.changeFontFormatting(e, 'fontStyle', (shape.fontStyle === 'italic' ? 'normal' : 'italic'))}>
              <span className={`icon icon-italic ${shape.fontStyle === 'italic' ? 'active' : null}`}></span>
            </button>
          </div>
          <label>
            Style
          </label>
        </div>
      </div>
    );
  }
}
