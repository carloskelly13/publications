import { Urls, baseRequestHeaders } from "./constants";
import get from "lodash/fp/get";
import { PubUser } from "../types/pub-objects";

export enum RestMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type SpringAuthResponse = { principal: { user: PubUser } };

export const setCsrfHeaders = (headers: Headers) => {
  window.sessionStorage.setItem(
    "x-csrf-header",
    headers.get("x-csrf-header") || ""
  );
  window.sessionStorage.setItem(
    "x-csrf-param",
    headers.get("x-csrf-token") || ""
  );
  window.sessionStorage.setItem(
    "x-csrf-token",
    headers.get("x-csrf-token") || ""
  );
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

type GetUserFromSpringResponse = (
  response: SpringAuthResponse
) => PubUser | null;
export const getUserFromSpringResponse: GetUserFromSpringResponse = get(
  "principal.user"
);

export async function apiRequest<T>(
  method: RestMethod,
  path: string,
  body?: Object,
  headers?: Headers
): Promise<T | null> {
  const response = await fetch(`${Urls.ApiBase}/${path}`, {
    method,
    credentials: baseRequestHeaders.credentials as RequestCredentials,
    body: method !== "GET" ? JSON.stringify(body) : undefined,
    headers: {
      ...baseRequestHeaders.headers,
      ...headers,
      ...(method !== "GET" ? getCsrfHeaders() : {}),
    } as HeadersInit,
  });
  if (response.status !== 200) {
    throw new Error(response.status.toString());
  }
  setCsrfHeaders(response.headers);
  return await response.json();
}
