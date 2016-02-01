import fetch from 'isomorphic-fetch'
import {Urls} from '../core/constants'

const PdfService = {
  downloadPdfBlob: id => {
    const token = sessionStorage.getItem('access-token') || ''

    return fetch(`${Urls.ApiBase}/documents/${id}/pdf`, {
      method: 'get',
      credentials: 'include'
    })
    .then(response => response.blob())
  }
}

export default PdfService
