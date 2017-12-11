import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
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
import {
  selectedShapeSelector,
  currentDocumentSelector,
  updateSelectedShape,
} from "../../modules/document";
import MetricInput from "./metric-input";
import IconButton from "../ui/icon-button";

const MetricsBarContainer = styled.div`
  height: 23px;
  width: calc(100% - 2em);
  padding: 4px 1em 0;
  background: ${AppColors.White};
  border-bottom: 1px solid ${AppColors.Gray40};
  z-index: 3;
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

export const MetricsBar = ({ shape, updateSelectedShape }) => {
  if (!shape) {
    return <MetricsBarContainer />;
  }

  let currentStyle = null;
  let isTextSelected = false;
  if (isText(shape)) {
    currentStyle = shape.editorState.getCurrentInlineStyle();
    isTextSelected = getSelectedText(shape.editorState) !== "";
  }

  return (
    <MetricsBarContainer>
      <ContentContainer verticalAlign>
        <MetricInput
          small
          property="x"
          value={shape.x}
          label="X"
          unit="in"
          onChange={updateSelectedShape}
        />
        <MetricInput
          small
          property="y"
          value={shape.y}
          label="Y"
          unit="in"
          onChange={updateSelectedShape}
        />
        <MetricInput
          small
          property="width"
          value={shape.width}
          label="Width"
          unit="in"
          onChange={updateSelectedShape}
        />
        <MetricInput
          small
          property="height"
          value={shape.height}
          label="Height"
          unit="in"
          onChange={updateSelectedShape}
        />
        {isText(shape) ? (
          <ColorPicker
            property="color"
            onChange={({ color }) =>
              updateSelectedShape({
                editorState: textStyles.color.add(shape.editorState, color),
              })
            }
            hex={colorFromStyles(currentStyle)}
            alpha={1}
          />
        ) : (
          <ColorPicker
            property="fill"
            onChange={updateSelectedShape}
            hex={shape.fill}
            alpha={shape.fillOpacity}
          />
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
                updateSelectedShape({
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
            onChange={updateSelectedShape}
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
            onChange={updateSelectedShape}
          />,
        ]}
        {supportsRadius(shape) && (
          <MetricInput
            mini
            property="r"
            value={shape.r}
            label="Radius"
            unit="pt"
            onChange={updateSelectedShape}
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
                updateSelectedShape({
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
                    ? AppColors.Highlight
                    : AppColors.DarkGray,
                size: 13,
              })}
            </IconButton>
          ))}
      </ContentContainer>
    </MetricsBarContainer>
  );
};

export default connect(
  state => ({
    shape: selectedShapeSelector(state),
    doc: currentDocumentSelector(state),
  }),
  {
    updateSelectedShape,
  }
)(MetricsBar);
