import React from "react"
import { connect } from "react-redux"
import Modal from "../modal"
import styled from "styled-components"
import { appFont, AppColors } from "../../core/constants"

const AppView = styled.div`
  font-family: ${appFont};
  color: ${AppColors.DarkGray};
  font-size: 14px;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0; left: 0; right: 0; bottom: 0;
`

import {
  activeModalSelector,
  activeModalPropsSelector
} from "../../selectors"

const BaseView = props => {
  const {
    children,
    activeModal,
    activeModalProps
  } = props

  return (
    <AppView>
      <Modal
        component={activeModal}
        componentProps={activeModalProps}
      />
      { children }
    </AppView>
  )
}

const mapStateToProps = state => ({
  activeModal: activeModalSelector(state),
  activeModalProps: activeModalPropsSelector(state)
})

export default connect(mapStateToProps)(BaseView)
