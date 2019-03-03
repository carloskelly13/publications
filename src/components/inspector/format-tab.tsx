import * as React from "react";
import styled from "styled-components";
import MetricInput, { InputLabel } from "../metrics-bar/metric-input";
import { StateContext } from "../../contexts";
import {
  getPropertyOrNull,
  isText,
  getStringPropertyOrNull,
  supportsRadius,
  supportsBorder,
} from "./format-tab-fns";
import { SectionTitle } from "./components";
import ColorPicker from "../color-picker";
import {
  colorFromStyles,
  sizeFromStyles,
  INLINE_STYLES,
} from "../../util/text";
import { styles as textStyles } from "../shapes/text-box";
import IconButton from "../ui/icon-button";
import { RichUtils } from "draft-js";
import { AppColors } from "../../util/constants";

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 0.4em));
  grid-gap: 0.8em;
  padding: 0 0.8em;
`;

const FontStyleGrid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

function FormatTab() {
  const {
    actions: { updateSelectedObject },
    selectedObject: shape,
  } = React.useContext(StateContext);

  let currentStyle = null;
  if (isText(shape)) {
    currentStyle = shape.editorState.getCurrentInlineStyle();
  }

  const setFontSize = React.useCallback(
    ({ fontSize }: { fontSize: string }) => {
      const numericValue = parseInt(fontSize, 10);
      if (!isNaN(numericValue) && numericValue >= 6 && numericValue <= 144) {
        updateSelectedObject({
          editorState: textStyles.fontSize.add(
            shape!.editorState,
            `${numericValue}px`
          ),
        });
      }
    },
    [updateSelectedObject, shape]
  );

  const setFill = React.useCallback(
    sender => {
      if (!isText(shape)) {
        updateSelectedObject(sender);
      }
      updateSelectedObject({
        editorState: textStyles.color.add(shape!.editorState, sender.color),
      });
    },
    [shape, updateSelectedObject]
  );

  return (
    <div>
      <SectionTitle>Metrics</SectionTitle>
      <ControlGrid>
        <MetricInput
          property="x"
          value={getPropertyOrNull(shape, "x")}
          label="X"
          unit="in"
          disabled={!shape}
          onChange={updateSelectedObject}
        />
        <MetricInput
          property="y"
          value={getPropertyOrNull(shape, "y")}
          label="Y"
          unit="in"
          disabled={!shape}
          onChange={updateSelectedObject}
        />
        <MetricInput
          property="width"
          value={getPropertyOrNull(shape, "width")}
          label="Width"
          unit="in"
          disabled={!shape}
          onChange={updateSelectedObject}
        />
        <MetricInput
          property="height"
          value={getPropertyOrNull(shape, "height")}
          label="Height"
          unit="in"
          disabled={!shape}
          onChange={updateSelectedObject}
        />
      </ControlGrid>
      <SectionTitle marginTop>Color</SectionTitle>
      <ControlGrid>
        <ColorPicker
          property={isText(shape) ? "color" : "fill"}
          onChange={setFill}
          hex={
            isText(shape)
              ? colorFromStyles(currentStyle)
              : getStringPropertyOrNull(shape, "fill")
          }
          disabled={!shape}
        />
        <MetricInput
          isHEX
          property={isText(shape) ? "color" : "fill"}
          value={
            isText(shape)
              ? colorFromStyles(currentStyle)
              : getStringPropertyOrNull(shape, "fill")
          }
          label="HEX"
          unit=""
          disabled={!shape}
          onChange={setFill}
        />
        {!isText(shape) && (
          <>
            <ColorPicker
              property="stroke"
              onChange={updateSelectedObject}
              hex={getStringPropertyOrNull(shape, "stroke")}
              disabled={!shape || isText(shape)}
            />
            <MetricInput
              isHEX
              property="stroke"
              value={getPropertyOrNull(shape, "stroke")}
              label="HEX"
              unit=""
              disabled={!shape}
              onChange={updateSelectedObject}
            />
          </>
        )}
      </ControlGrid>
      <SectionTitle marginTop>Border</SectionTitle>
      <ControlGrid>
        <MetricInput
          property="strokeWidth"
          value={getPropertyOrNull(shape, "strokeWidth")}
          label="Border"
          unit="pt"
          disabled={!shape || !supportsBorder(shape)}
          onChange={updateSelectedObject}
        />
        <MetricInput
          property="r"
          value={getPropertyOrNull(shape, "r")}
          label="Radius"
          unit="pt"
          disabled={!shape || !supportsRadius(shape)}
          onChange={updateSelectedObject}
        />
      </ControlGrid>
      <SectionTitle marginTop>Font</SectionTitle>
      <ControlGrid>
        <MetricInput
          property="fontSize"
          value={isText(shape) ? sizeFromStyles(currentStyle) : null}
          label="Size"
          unit="pt"
          disabled={!shape}
          onChange={setFontSize}
        />
        <FontStyleGrid>
          <InputLabel
            center
            color={AppColors.LightGray}
            size="0.75em"
            mr="0.33em"
          >
            Style:
          </InputLabel>
          {INLINE_STYLES.map(type => (
            <IconButton
              key={type.label}
              size={15}
              style={{ margin: "0 0.25em" }}
              disabled={!isText(shape)}
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
                  isText(shape) && currentStyle!.has(type.style)
                    ? AppColors.White
                    : AppColors.MidTextGray,
                size: 13,
              })}
            </IconButton>
          ))}
        </FontStyleGrid>
      </ControlGrid>
    </div>
  );
}

export default React.memo(FormatTab);
