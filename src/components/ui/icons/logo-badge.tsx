import React from "react";
import posed from "react-pose";

const PathOne = posed.path({
  visible: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: { delay: 500, duration: 1000, ease: "anticipate" },
  },
  hidden: { opacity: 0, transform: "translate(10, -10)" },
});

const PathTwo = posed.path({
  visible: {
    opacity: 1,
    transform: "translate(0, 0)",
    transition: { delay: 500, duration: 1000, ease: "anticipate" },
  },
  hidden: { opacity: 0, transform: "translate(-10, 10)" },
});

const Rect = posed.rect({
  visible: {
    height: 62,
    transition: { delay: 1100, type: "spring", stiffness: 70 },
  },
  hidden: { height: 0 },
});

interface State {
  startAnimation: boolean;
}

class LogoBadge extends React.PureComponent<{}, State> {
  readonly state = { startAnimation: false };

  componentDidMount() {
    this.setState({ startAnimation: true });
  }

  render() {
    return (
      <svg
        width="120"
        height="120"
        viewBox="0 0 70 70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <Rect
            pose={this.state.startAnimation ? "visible" : "hidden"}
            fill="#fff"
            transform="rotate(225 43.517 26.517)"
            x="39.517"
            y="-6.983"
            rx={1}
            ry={1}
            width="8"
            height="67"
          />
          <PathTwo
            pose={this.state.startAnimation ? "visible" : "hidden"}
            d="M1,12 L1,23 L47,23 L47,69 L58,69 L58,12 L1,12 Z"
            stroke="#2C2D30"
            strokeWidth="2"
            fill="#fff"
          />
          <PathOne
            pose={this.state.startAnimation ? "visible" : "hidden"}
            d="M66,61 L66,50 L20,50 L20,4 L9,4 L9,61 L66,61 Z"
            stroke="#2C2D30"
            strokeWidth="2"
            fill="#fff"
          />
        </g>
      </svg>
    );
  }
}

export default LogoBadge;
