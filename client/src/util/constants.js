export const Urls = {
  ApiBase: `http://${window.location.host}/api`,
};

export const Typefaces = ["Source Sans Pro"];

export const metrics = {
  portrait: { width: 8.5, height: 11 },
  landscape: { width: 11, height: 8.5 },
};

export const appFont =
  // eslint-disable-next-line quotes
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Helvetica, sans-serif';

export const colors = [
  "#fff",
  "#f5f5f5",
  "#e0e0e0",
  "#bdbdbd",
  "#9e9e9e",
  "#757575",
  "#616161",
  "#424242",
  "#212121",
  "#000",
  "#d50000",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#ba68c8",
  "#7e57c2",
  "#3f51b5",
  "#2196f3",
  "#90caf9",
  "#03A9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#aeea00",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
];

export const Keys = {
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  Esc: 27,
  Delete: 8,
};

export const breakpointLg = "min-width: 768px";

export const AppColors = {
  Active: "#727172",
  ActiveDark: "#626162",
  ActiveLight: "#685ffd",
  LightGray: "#f5f5f5",
  Border: "#aaa",
  Background: "#4b4545",
  MediumGray: "#f0f0f0",
  Gray: "#e5e5e5",
  WarmGray: "#efe9e9",
  MidTextGray: "#7a7b7a",
  DisabledGray: "#7d7373",
  LightActive: "#e9e8f5",
  IconColor: "#444",
  Gray20: "#c0bfc0",
  Gray30: "#9fa3a3",
  Gray40: "#8c9090",
  Gray50: "#6f7878",
  Gray60: "#535a5a",
  Gray80: "#343334",
  DarkGray: "#373232",
  ReallyDarkGray: "#2a2626",
  BrightWarmWhite: "#fbf8f8",
  White: "#fefefe",
  WarmWhite: "#f6f3f3",
  WarmMidWhite: "#e6e3e3",
  White4: "#f3f3f3",
  Highlight: "#9b82f3",
  HighlightDark: "#785ef0",
  HighlightReallyDark: "#473793",
};

export const Colors = {
  App: {
    Background: "#2b2c2f",
    Toolbar: "#38393d",
    ToolbarBorder: "#1e1f21",
  },
  Button: {
    Border: "hsla(0, 0%, 0%, 0.5)",
    Outline: "#9b82f3",
    Background: "#5c5e65",
    Text: "#fff",
  },
  Menu: {
    Background: "rgba(41, 41, 44, 0.95)",
    ButtonActiveBackground: "rgba(91, 91, 94, 0.55)",
    MenuBorder: "rgba(91, 91, 94, 0.45)",
    Text: "#fff",
  },
  Modal: {
    ModalBackground: "#2c2d30",
    TitleText: "#fff",
    FrameHighlight: "#4a4b50",
    ButtonContainerBorder: "#1e1f21",
    ButtonContainerBackground: "#38393d",
  },
  FormInput: {
    Background: "#38393d",
    MetricBackground: "#4a4b50",
    Text: "#fff",
    Border: "hsla(0, 0%, 100%, 0.01)",
    FocusBorder: "#785ef0",
    FocusOutline: "#9b82f3",
    Placeholder: "#6a6c71",
  },
  NewDocument: {
    RadioBorder: "hsla(0, 0%, 0%, 0.5)",
    RadioText: "#fff",
    RadioBackground: "#5c5e65",
    RadioSelectedText: "white",
    RadioSelectedBorder: "#785ef0",
    RadioSelectedOutline: "#9b82f3",
    RadioSelectedBackground: "#9b82f3",
  },
  OpenDocument: {
    FileBrowserBorder: "#a6a5a6",
  },
  StartModal: {
    ButtonIcon: "#fff",
    ButtonText: "#fff",
    ButtonActiveBorder: "#9b82f3",
  },
  Logo: {
    Outline: "#9b82f3",
    Background: "#4b4545",
  },
  StartView: {
    AppNameColor: "#9b82f3",
  },
  DocumentThumbnail: {
    Outline: "#5f5757",
    SelectedOutline: "#9b82f3",
  },
  LayersSidebar: {
    Text: "#fff",
    Background: "#38393d",
    Border: "#1e1f21",
    ItemSelectedBackground: "hsla(0, 0%, 100%, 0.25)",
    ItemBorder: "hsla(0, 0%, 0%, 0.33)",
  },
  Rulers: {
    Background: "#38393d",
    Text: "#fff",
  },
  Forms: {
    ErrorText: "#e62325",
  },
};

export const baseRequestHeaders = {
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const newDocument = {
  name: "Untitled Document",
  width: 8.5,
  height: 11,
  shapes: [],
  new: true,
};
