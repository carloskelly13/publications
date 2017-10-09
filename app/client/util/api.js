import { Urls, baseRequestHeaders } from "./constants"

export const get = (path, opts = {}) => fetch(`${Urls.ApiBase}/${path}`, {
  method: "GET",
  ...baseRequestHeaders,
  ...opts
})

export const post = (path, body = {}, opts = {}) => fetch(`${Urls.ApiBase}/${path}`, {
  method: "POST",
  ...baseRequestHeaders,
  body: JSON.stringify(body),
  ...opts
})

export default {
  get,
  post
}
