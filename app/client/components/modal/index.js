import React from "react"
import styled, { injectGlobal } from "styled-components"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { connect } from "react-redux"
import {
  activeModalPropsSelector
} from "../../state/selectors"

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  .modal-transition-enter {
    opacity: 0;
  }

  .modal-transition-enter.modal-transition-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in-out;
  }

  .modal-transition-leave {
    opacity: 1;
  }

  .modal-transition-leave.modal-transition-leave-active {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  }
`

const ModalContainer = styled.div`
  align-items: center;
  background: hsla(0, 0%, 0%, 0.5);
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  left: 0;
  justify-content: space-around;
  overflow: hidden;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 9005;

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background-color: hsla(0, 0%, 0%, 0.15);
  }
`

export const ModalContent = styled.div`
  background: #fff;
  box-shadow: 0 1px 10px hsla(0, 0%, 0%, 0.25);
  border-radius: 6px;
  margin: auto;
  padding: 1em 1em calc(1em + 50px);
  position: relative;
  overflow: hidden;
`

const Modal = ({
  component: ModalComponent,
  activeModalProps: componentProps
}) => (
  <ReactCSSTransitionGroup
    transitionName="modal-transition"
    transitionEnterTimeout={200}
    transitionLeaveTimeout={350}
  >
    { !!ModalComponent && (
      <ModalContainer>
        <ModalComponent {...componentProps} />
      </ModalContainer>
    ) }
  </ReactCSSTransitionGroup>
)

const mapStateToProps = state => ({
  activeModalProps: activeModalPropsSelector(state)
})

export default connect(mapStateToProps)(Modal)
