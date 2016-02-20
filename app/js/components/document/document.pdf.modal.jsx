import React, {Component, PropTypes} from 'react'
import {downloadPdfBlob} from 'services/pdf.service'
import {autobind} from 'core-decorators'

export default class DocumentPdfViewModal extends Component {
  constructor() {
    super(...arguments)
    this.state = {currentUrl: null}
    this.pdfLinkRef = null
  }

  componentDidUpdate() {
    if (this.props.isOpen) {
      const {id} = this.props.doc

      downloadPdfBlob(id)
        .then(blob => {
          const url = URL.createObjectURL(blob)
          const {pdfLinkRef} = this

          pdfLinkRef.href = url
          pdfLinkRef.innerHTML = 'Download'
          pdfLinkRef.setAttribute('download', `${this.props.doc.name}.pdf`)
          this.state.currentUrl = url
        })
    }
  }

  render() {
    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-pdf">
            <div className="modal-content">
              <div className="modal-header">
                <h1>Export PDF</h1>
                <h3>{this.props.doc.name} has been exported to PDF.</h3>
              </div>
              <div className="modal-form-buttons">
                <a
                  className="btn"
                  role="button"
                  href="#"
                  target="_blank"
                  ref={pdfLinkRef => this.pdfLinkRef = pdfLinkRef}>
                  Exporting…
                </a>
                <button className="btn" type="button" onClick={this.dismiss}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }

  @autobind
  dismiss() {
    if (this.state.currentUrl) {
      URL.revokeObjectURL(this.state.currentUrl)
      this.state.currentUrl = null
    }

    this.props.togglePdfDownloadModal()
  }
}
