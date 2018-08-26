import React from "react";
import styled from "styled-components";
import { RichUtils, DraftInlineStyle } from "draft-js";
import { styles as textStyles } from "../shapes/text-box";
import ColorPicker from "../color-picker";
import {
  colorFromStyles,
  sizeFromStyles,
  getSelectedText,
  INLINE_STYLES,
} from "../../util/text";
import { AppColors, Colors } from "../../util/constants";
import { ContentContainer } from "../ui/containers";
import MetricInput from "./metric-input";
import IconButton from "../ui/icon-button";
import { StateContext } from "../../contexts";
import { PubShape, PubShapeType } from "../../types/pub-objects";

const MetricsBarContainer = styled.div`
  display: block;
  z-index: 3;
`;

const MetricsBarContent = styled.div`
  height: 23px;
  width: calc(100% - 2em);
  padding: 4px 1em 0;
  background: ${Colors.App.Toolbar};
  border-bottom: 1px solid ${Colors.App.ToolbarBorder};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media print {
    display: none;
  }
`;

function getPropertyOrNull(
  object: PubShape | null,
  property: string
): number | null {
  if (!object || typeof object[property] === "undefined") {
    return null;
  }
  return object[property];
}

const supportsBorder = (shape: PubShape | null) =>
  shape &&
  (shape.type === PubShapeType.Rectangle ||
    shape.type === PubShapeType.Ellipse);
const supportsRadius = (shape: PubShape | null) =>
  shape && shape.type === PubShapeType.Rectangle;
const isText = (shape: PubShape | null) =>
  shape && shape.type === PubShapeType.Text;

interface Props {
  shape: PubShape | null;
  updateSelectedObject(sender: Object | null): void;
}

const MetricsBar: React.StatelessComponent<Props> = ({
  updateSelectedObject,
  shape,
}) => {
  let currentStyle: DraftInlineStyle | null = null;
  let isTextSelected = false;
  if (isText(shape)) {
    currentStyle = shape!.editorState!.getCurrentInlineStyle();
    isTextSelected = getSelectedText(shape!.editorState) !== "";
  }
  return (
    <MetricsBarContainer>
      <MetricsBarContent>
        <ContentContainer verticalAlign>
          <MetricInput
            small
            property="x"
            value={getPropertyOrNull(shape, "x")}
            label="X"
            unit="in"
            disabled={!shape}
            onChange={updateSelectedObject}
          />
          <MetricInput
            small
            property="y"
            value={getPropertyOrNull(shape, "y")}
            label="Y"
            unit="in"
            disabled={!shape}
            onChange={updateSelectedObject}
          />
          <MetricInput
            small
            property="width"
            value={getPropertyOrNull(shape, "width")}
            label="Width"
            unit="in"
            disabled={!shape}
            onChange={updateSelectedObject}
          />
          <MetricInput
            small
            property="height"
            value={getPropertyOrNull(shape, "height")}
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
                  editorState: textStyles.color.add(shape!.editorState, color),
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
              onChange={({ fontSize }: { fontSize: string }) => {
                const numericValue = parseInt(fontSize, 10);
                if (
                  !isNaN(numericValue) &&
                  numericValue >= 6 &&
                  numericValue <= 144
                ) {
                  updateSelectedObject({
                    editorState: textStyles.fontSize.add(
                      shape!.editorState,
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
              hex={shape!.stroke}
              alpha={shape!.strokeOpacity}
            />,
            <MetricInput
              mini
              property="strokeWidth"
              key="stroke-metric-input"
              value={shape!.strokeWidth}
              label="Border"
              unit="pt"
              onChange={updateSelectedObject}
            />,
          ]}
          {supportsRadius(shape) && (
            <MetricInput
              mini
              property="r"
              value={shape!.r}
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
                      shape!.editorState!,
                      type.style
                    ),
                  })
                }
              >
                {React.createElement(type.icon, {
                  color:
                    currentStyle!.has(type.style) && isTextSelected
                      ? AppColors.White
                      : AppColors.MidTextGray,
                  size: 13,
                })}
              </IconButton>
            ))}
        </ContentContainer>
      </MetricsBarContent>
    </MetricsBarContainer>
  );
};

export default () => (
  <StateContext.Consumer>
    {({ actions: { updateSelectedObject }, selectedObject }) => (
      <MetricsBar
        shape={selectedObject}
        updateSelectedObject={updateSelectedObject}
      />
    )}
  </StateContext.Consumer>
);
