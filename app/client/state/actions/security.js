export const SET_CSRF_HEADERS = "SET_CSRF_HEADERS"
export const RESET_CSRF_HEADERS = "RESET_CSRF_HEADERS"

export const setCsrfHeaders = headers => dispatch => dispatch({
  type: SET_CSRF_HEADERS,
  csrfHeaders: {
    "x-csrf-header": headers.get("x-csrf-header"),
    "x-csrf-param": headers.get("x-csrf-param"),
    "x-csrf-token": headers.get("x-csrf-token")
  }
})

export const resetCsrfHeaders = () => dispatch => dispatch({
  type: RESET_CSRF_HEADERS
})
