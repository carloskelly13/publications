import React from "react";
import styled from "styled-components";
import getOr from "lodash/fp/getOr";
import { RichUtils } from "draft-js";
import { styles as textStyles } from "../shapes/text-box";
import ColorPicker from "./../color-picker";
import {
  colorFromStyles,
  sizeFromStyles,
  getSelectedText,
  INLINE_STYLES,
} from "../../util/text";
import { AppColors } from "../../util/constants";
import { ContentContainer } from "../ui/containers";
import MetricInput from "./metric-input";
import IconButton from "../ui/icon-button";
import { ActionsContext } from "../../contexts";

const MetricsBarContainer = styled.div`
  display: block;
  z-index: 3;
`;

const MetricsBar = styled.div`
  height: 23px;
  width: calc(100% - 2em);
  padding: 4px 1em 0;
  background: ${AppColors.DarkGray};
  border-bottom: 1px solid ${AppColors.ReallyDarkGray};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media print {
    display: none;
  }
`;

const supportsBorder = shape =>
  !!shape && ["rect", "ellipse"].includes(shape.type);
const supportsRadius = shape => !!shape && shape.type === "rect";
const isText = shape => !!shape && shape.type === "text";

const get = getOr("");

export default class extends React.Component {
  render() {
    const { shape } = this.props;
    let currentStyle = null;
    let isTextSelected = false;
    if (isText(shape)) {
      currentStyle = shape.editorState.getCurrentInlineStyle();
      isTextSelected = getSelectedText(shape.editorState) !== "";
    }

    return (
      <ActionsContext.Consumer>
        {({ updateSelectedObject }) => (
          <MetricsBarContainer>
            <MetricsBar>
              <ContentContainer verticalAlign>
                <MetricInput
                  small
                  property="x"
                  value={get("x", shape)}
                  label="X"
                  unit="in"
                  disabled={!shape}
                  onChange={updateSelectedObject}
                />
                <MetricInput
                  small
                  property="y"
                  value={get("y", shape)}
                  label="Y"
                  unit="in"
                  disabled={!shape}
                  onChange={updateSelectedObject}
                />
                <MetricInput
                  small
                  property="width"
                  value={get("width", shape)}
                  label="Width"
                  unit="in"
                  disabled={!shape}
                  onChange={updateSelectedObject}
                />
                <MetricInput
                  small
                  property="height"
                  value={get("height", shape)}
                  label="Height"
                  unit="in"
                  disabled={!shape}
                  onChange={updateSelectedObject}
                />
                {isText(shape) ? (
                  <ColorPicker
                    property="color"
                    onChange={({ color }) =>
                      updateSelectedObject({
                        editorState: textStyles.color.add(
                          shape.editorState,
                          color
                        ),
                      })
                    }
                    hex={colorFromStyles(currentStyle)}
                    alpha={1}
                  />
                ) : (
                  shape && (
                    <ColorPicker
                      property="fill"
                      onChange={updateSelectedObject}
                      hex={shape.fill}
                      alpha={shape.fillOpacity}
                    />
                  )
                )}
                {isText(shape) && (
                  <MetricInput
                    mini
                    property="fontSize"
                    value={sizeFromStyles(currentStyle)}
                    label="Size"
                    unit="px"
                    onChange={({ fontSize }) => {
                      const numericValue = parseInt(fontSize);
                      if (
                        !isNaN(numericValue) &&
                        numericValue >= 6 &&
                        numericValue <= 144
                      ) {
                        updateSelectedObject({
                          editorState: textStyles.fontSize.add(
                            shape.editorState,
                            `${numericValue}px`
                          ),
                        });
                      }
                    }}
                  />
                )}
                {supportsBorder(shape) && [
                  <ColorPicker
                    key="stroke-color-picker"
                    property="stroke"
                    onChange={updateSelectedObject}
                    hex={shape.stroke}
                    alpha={shape.strokeOpacity}
                  />,
                  <MetricInput
                    mini
                    property="strokeWidth"
                    key="stroke-metric-input"
                    value={shape.strokeWidth}
                    label="Border"
                    unit="pt"
                    onChange={updateSelectedObject}
                  />,
                ]}
                {supportsRadius(shape) && (
                  <MetricInput
                    mini
                    property="r"
                    value={shape.r}
                    label="Radius"
                    unit="pt"
                    onChange={updateSelectedObject}
                  />
                )}
                {isText(shape) &&
                  INLINE_STYLES.map(type => (
                    <IconButton
                      key={type.label}
                      size={15}
                      disabled={!isTextSelected}
                      style={{ margin: "0 0.25em" }}
                      onClick={() =>
                        updateSelectedObject({
                          editorState: RichUtils.toggleInlineStyle(
                            shape.editorState,
                            type.style
                          ),
                        })
                      }
                    >
                      {React.createElement(type.icon, {
                        color:
                          currentStyle.has(type.style) && isTextSelected
                            ? AppColors.White
                            : AppColors.MidTextGray,
                        size: 13,
                      })}
                    </IconButton>
                  ))}
              </ContentContainer>
            </MetricsBar>
          </MetricsBarContainer>
        )}
      </ActionsContext.Consumer>
    );
  }
}
