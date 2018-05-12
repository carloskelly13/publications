// @flow
import { Urls, baseRequestHeaders } from "./constants";
import get from "lodash/fp/get";
import type { PubUser } from "./types";

type RestMethod = "POST" | "GET" | "PUT" | "DELETE";

export const setCsrfHeaders = (headers: Headers) => {
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

type APIRequest = (
  path: string,
  body: ?Object,
  headers: ?Object
) => Promise<Object>;

export const getUserFromAuth: () => PubUser = get("principal.user");

const apiRequestForMethod = (method: RestMethod): APIRequest => async (
  path,
  body = {},
  headers = {}
) => {
  const response = await fetch(`${Urls.ApiBase}/${path}`, {
    method,
    credentials: baseRequestHeaders.credentials,
    body: method !== "GET" ? JSON.stringify(body) : undefined,
    headers: {
      ...baseRequestHeaders.headers,
      ...headers,
      ...(method !== "GET" ? getCsrfHeaders() : {}),
    },
  });
  if (response.status !== 200) {
    throw new Error(response.status);
  }
  setCsrfHeaders(response.headers);
  return await response.json();
};

export default {
  GET: apiRequestForMethod("GET"),
  POST: apiRequestForMethod("POST"),
  PUT: apiRequestForMethod("PUT"),
  DELETE: apiRequestForMethod("DELETE"),
};
