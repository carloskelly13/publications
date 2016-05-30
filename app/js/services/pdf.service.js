import fetch from 'isomorphic-fetch'
import { Urls } from 'core/constants'

export const downloadPdfBlob = id => {
  const token = sessionStorage.getItem('access-token') || ''

  return fetch(`${Urls.ApiBase}/documents/${id}/pdf`, {
    method: 'get',
    credentials: 'include'
  })
  .then(response => response.blob())
}
