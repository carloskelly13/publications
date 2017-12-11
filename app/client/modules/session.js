import { put, takeEvery, call } from "redux-saga/effects";
import { handleActions, createAction } from "redux-actions";
import API from "../util/api";

const initialState = {
  activeUser: null,
  csrfHeaders: {},
  loginRequestFailed: false,
  currentUserRequestFailed: false,
};

/**
 * ACTIONS
 */

export const fetchUser = createAction("FETCH_USER_REQUEST");
export const fetchCurrentUser = createAction("FETCH_CURRENT_USER_REQUEST");
export const logOut = createAction("DELETE_SESSION");

/**
 * SAGAS
 */

const receiveUser = function*(response) {
  const user = yield response.json();
  yield put({
    type: "SET_CSRF_HEADERS",
    payload: { headers: response.headers },
  });
  yield put({ type: "FETCH_USER_SUCCESS", payload: { user } });
};

const login = function*({ payload }) {
  const response = yield call(API.post, "users/login", payload);
  if (response.status !== 200) {
    yield put({ type: "FETCH_USER_FAILED" });
    return;
  }
  yield* receiveUser(response);
};

const getUser = function*() {
  const response = yield call(API.get, "users/current");
  if (response.status !== 200) {
    yield put({ type: "FETCH_CURRENT_USER_FAILED" });
    return;
  }
  yield* receiveUser(response);
};

const deleteSession = function*() {
  yield call(API.post, "users/logout");
  yield put({ type: "CLEAR_CSRF_HEADERS" });
  yield put({ type: "FETCH_USER_SUCCESS", payload: { user: null } });
};

export default function*() {
  yield takeEvery("FETCH_USER_REQUEST", login);
  yield takeEvery("FETCH_CURRENT_USER_REQUEST", getUser);
  yield takeEvery("DELETE_SESSION", deleteSession);
}

/**
 * REDUCER
 */
export const sessionReducer = handleActions(
  {
    FETCH_USER_SUCCESS: (state, action) => ({
      ...state,
      loginRequestFailed: false,
      currentUserRequestFailed: false,
      user: action.payload.user,
    }),

    FETCH_USER_FAILURE: state => ({
      ...state,
      loginRequestFailed: true,
    }),

    FETCH_CURRENT_USER_FAILED: state => ({
      ...state,
      currentUserRequestFailed: true,
    }),

    SET_CSRF_HEADERS: (state, action) => ({
      ...state,
      csrfHeaders: {
        "x-csrf-header": action.payload.headers.get("x-csrf-header"),
        "x-csrf-param": action.payload.headers.get("x-csrf-param"),
        "x-csrf-token": action.payload.headers.get("x-csrf-token"),
      },
    }),

    CLEAR_CSRF_HEADERS: state => ({
      ...state,
      csrfHeaders: {},
    }),
  },
  initialState
);

/**
 * SELECTORS
 */

export const currentUserSelector = state => state.session.user;
export const csrfHeadersSelector = state => state.session.csrfHeaders;
export const currentUserRequestFailedSelector = state =>
  state.session.currentUserRequestFailed;
