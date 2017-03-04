import React from "react"
import styled from "styled-components"

export const PubInput = styled.input`
  border: 1px solid #b8b7b9;
  border-radius: ${({ label }) => !!label ? "2px 0 0 2px" : "2px"};
  box-sizing: border-box;
  color: #444;
  display: ${({ block }) => block ? "block" : "inline-block"};
  font-size: 13px;
  line-height: 1em;
  margin: 0;
  padding: 4px 6px;
  vertical-align: middle;
  width: ${({ block }) => block ? "100%" : "auto"};
`

const FormInputContainer = styled.div`
  flex: 1;
`

const FormInputLabel = styled.label`
  display: block;
  font-size: 0.75em;
  font-weight: 500;
  color: #555;
  margin: 0.25em 0 0;
`

const PubInputLabel = styled.span`
  background: #f0f0f0;
  border-right: 1px #b8b7b9 solid;
  border-top: 1px #b8b7b9 solid;
  border-bottom: 1px #b8b7b9 solid;
  border-radius: 0 2px 2px 0;
  font-weight: 600;
  font-size: 11px;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
`

export const FormGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0 0;
  div { margin: 0 5px; }
  div:first-child { margin: 0 5px 0 0; }
  div:last-child { margin: 0 0 0 5px; }
  div:only-child { margin: 0; }
`

const PubInputGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const FormInput = ({
  onChange, name, value, displayName, marginBottom, marginRight, label
}) => (
  <FormInputContainer
    marginBottom={marginBottom}
    marginRight={marginRight}
  >
    <PubInputGroup>
      <PubInput
        block
        label={label}
        id={name}
        onChange={onChange}
        name={name}
        value={value}
      />
      { !!label && (
        <PubInputLabel>
          { label }
        </PubInputLabel>
      ) }
    </PubInputGroup>
    <FormInputLabel htmlFor={name}>
      {displayName}
    </FormInputLabel>
  </FormInputContainer>
)
