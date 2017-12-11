import { createAction, handleActions } from "redux-actions";

const initialState = {
  activeModal: null,
  activeModalProps: null,
  sidePanelVisible: false,
};

/**
 * Actions
 */

export const toggleSidePanel = createAction("TOGGLE_SIDE_PANEL");
export const showModal = createAction("SHOW_MODAL", (component, props) => ({
  component,
  props,
}));
export const hideModal = createAction("HIDE_MODAL");

/**
 * Reducer
 */

export const uiReducer = handleActions(
  {
    SHOW_MODAL: (state, action) => ({
      ...state,
      activeModal: action.payload.component,
      activeModalProps: action.payload.props,
    }),

    HIDE_MODAL: state => ({
      ...state,
      activeModal: null,
      activeModalProps: null,
    }),

    TOGGLE_SIDE_PANEL: state => ({
      ...state,
      sidePanelVisible: !state.sidePanelVisible,
    }),
  },
  initialState
);

/**
 * SELECTORS
 */

export const activeModalSelector = state => state.ui.activeModal;
export const activeModalPropsSelector = state => state.ui.activeModalProps;
export const sidePanelVisibleSelector = state => state.ui.sidePanelVisible;
