import { Urls, baseRequestHeaders } from "./constants";

export default {
  GET: path =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "GET",
      ...baseRequestHeaders,
    }),

  POST: (path, body = {}, headers = {}) =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "POST",
      credentials: baseRequestHeaders.credentials,
      body: JSON.stringify(body),
      headers: {
        ...baseRequestHeaders.headers,
        ...headers,
      },
    }),

  PUT: (path, body = {}, headers = {}) =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "PUT",
      credentials: baseRequestHeaders.credentials,
      body: JSON.stringify(body),
      headers: {
        ...baseRequestHeaders.headers,
        ...headers,
      },
    }),

  DELETE: (path, headers = {}) =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "DELETE",
      credentials: baseRequestHeaders.credentials,
      headers: {
        ...baseRequestHeaders.headers,
        ...headers,
      },
    }),
};
