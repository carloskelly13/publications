import { Urls, baseRequestHeaders } from "./constants";

const responseHandler = response => {
  if (response.status !== 200) {
    throw new Error(response.status);
  }
  setCsrfHeaders(response.headers);
  return response.json();
};

export const setCsrfHeaders = headers => {
  window.sessionStorage.setItem("x-csrf-header", headers.get("x-csrf-header"));
  window.sessionStorage.setItem("x-csrf-param", headers.get("x-csrf-token"));
  window.sessionStorage.setItem("x-csrf-token", headers.get("x-csrf-token"));
};

export const clearCsrfHeaders = () => {
  window.sessionStorage.removeItem("x-csrf-header");
  window.sessionStorage.removeItem("x-csrf-param");
  window.sessionStorage.removeItem("x-csrf-token");
};

export const getCsrfHeaders = () => ({
  "x-csrf-header": window.sessionStorage.getItem("x-csrf-header"),
  "x-csrf-param": window.sessionStorage.getItem("x-csrf-param"),
  "x-csrf-token": window.sessionStorage.getItem("x-csrf-token"),
});

export default {
  GET: path =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "GET",
      ...baseRequestHeaders,
    }).then(responseHandler),

  POST: (path, body = {}, headers = {}) =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "POST",
      credentials: baseRequestHeaders.credentials,
      body: JSON.stringify(body),
      headers: {
        ...baseRequestHeaders.headers,
        ...headers,
        ...getCsrfHeaders(),
      },
    }).then(responseHandler),

  PUT: (path, body = {}, headers = {}) =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "PUT",
      credentials: baseRequestHeaders.credentials,
      body: JSON.stringify(body),
      headers: {
        ...baseRequestHeaders.headers,
        ...headers,
        ...getCsrfHeaders(),
      },
    }).then(responseHandler),

  DELETE: (path, headers = {}) =>
    fetch(`${Urls.ApiBase}/${path}`, {
      method: "DELETE",
      credentials: baseRequestHeaders.credentials,
      headers: {
        ...baseRequestHeaders.headers,
        ...headers,
        ...getCsrfHeaders(),
      },
    }).then(responseHandler),
};
