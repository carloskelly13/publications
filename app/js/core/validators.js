/**
 * Publications
 * Validators
 */

import isString from "lodash.isstring"

const validateSize = value => {
  const numValue = parseFloat(value)
  return !isNaN(numValue) && numValue >= 0.25 && numValue <= 100
}

const validateName = value => {
  return isString(value) && value.length > 0
}

const validateBounds = value => {
  const numValue = parseFloat(value)
  return !isNaN(numValue) && numValue >= -200 && numValue <= 200
}

export const validators = {
  name: validateName,
  size: validateSize,
  bounds: validateBounds
}

/**
 * Validate a form
 * @param {Array} formValues An array of objects with the properties
 * value and validator
 * @return {bool} True or false based on the form is valid
 */
export const validateForm = formValues => formValues.reduce(
  (memo, { value, type }) => memo && validators[type](value), true
)
