import { all, takeEvery, select } from "redux-saga/effects";
import { combineReducers } from "redux";
import sessionSaga, { sessionReducer } from "./session";
import documentSaga, { documentReducer } from "./document";
import { uiReducer } from "./ui";
import { routerReducer } from "react-router-redux";

// eslint-disable-next-line no-unused-vars
const logger = function*() {
  yield takeEvery("*", function*(action) {
    const state = yield select();
    // eslint-disable-next-line no-console
    console.debug("Action/State", action, state);
  });
};

export default function*() {
  yield all([
    // logger(),
    sessionSaga(),
    documentSaga(),
  ]);
}

export const rootReducer = combineReducers({
  routing: routerReducer,
  session: sessionReducer,
  doc: documentReducer,
  ui: uiReducer,
});
