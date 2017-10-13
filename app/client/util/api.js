import { Urls, baseRequestHeaders } from "./constants"

export const get = path => fetch(`${Urls.ApiBase}/${path}`, {
  method: "GET",
  ...baseRequestHeaders
})

export const post = (path, body = {}, headers = {}) => fetch(`${Urls.ApiBase}/${path}`, {
  method: "POST",
  credentials: baseRequestHeaders.credentials,
  body: JSON.stringify(body),
  headers: {
    ...baseRequestHeaders.headers,
    ...headers
  }
})

export const put = (path, body = {}, headers = {}) => fetch(`${Urls.ApiBase}/${path}`, {
  method: "PUT",
  credentials: baseRequestHeaders.credentials,
  body: JSON.stringify(body),
  headers: {
    ...baseRequestHeaders.headers,
    ...headers
  }
})

export default {
  get,
  post,
  put
}
