import fetch from 'isomorphic-fetch'

const PdfService = {
  downloadPdfBlob: id => {
    const token = sessionStorage.getItem('access-token') || ''

    return fetch(`http://api.publicationsapp.com/documents/${id}/pdf`, {
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response => response.blob())
  }
}

export default PdfService
