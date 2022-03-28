/**
 * This file consists of a set helper functions, which the frontend will use to communicate
 * with our backend, i.e. participating as a controller to the model.
 */

// Including all for completion sake. https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
type HttpRequestMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'CONNECT'
  | 'TRACE'
  | 'OPTIONS'
  | 'PATCH';

import {UserObject} from '../types/api';
type UserAndTokenBody = UserObject & {
  token: string;
};

type fetchWithTokenResponse<responseBody> =
  // The response-fields will be empty if the browser has no token in storage
  // Fields if token is missing
  | {missingToken: true}
  // Fields if token is not missing
  | {
      missingToken: false;
      headers: Headers;
      status: number;
      body?: responseBody;
    };

import {RegisterUserObject} from '../components/types';
/**
 * The default wrapper for any request after authentication. The function allows our frontend to make requests while this
 * function handles authentication (provided that the user is already signed in).
 *
 * @param endpoint api endpoint
 * @param method e.g. POST, PUT, GET etc.
 * @param body request body
 */
export async function fetchWithToken<ResponseBody>(
  endpoint: string,
  method: HttpRequestMethod,
  body?: Record<string, unknown> | string
): Promise<fetchWithTokenResponse<ResponseBody>> {
  const token = localStorage.getItem('token');

  // Do not perform the request is the token is missing
  /*
  if (!token) {
    return {missingToken: true};
  }*/

  // Perform request to backend with token
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    ...(body && {body: JSON.stringify(body)}),
  });

  // Attempt to parse response body if it exists
  let responseBody: ResponseBody | undefined = undefined;
  const contentEncoding = response.headers.get('Content-Encoding');
  const contentLength = response.headers.get('Content-Length');
  if (contentEncoding?.includes('gzip')) {
    await response
      .text()
      .then(text => {
        responseBody = JSON.parse(text);
      })
      .catch(e => {
        console.error('Parsing of body failed');
        console.error(e);
        console.error(response);
      });
  } else if (contentLength && parseInt(contentLength)) {
    await response
      .json()
      .then(body => {
        responseBody = body;
      })
      .catch(e => {
        console.error('Parsing of body failed');
        console.error(e);
        console.error(response);
      });
  }

  // Return response
  return {
    missingToken: !token,
    headers: response.headers,
    status: response.status,
    body: responseBody,
  };
}

const saveUserToLocalStorage = (responseBody: UserObject) => {
  const body = {...responseBody, token: undefined};
  const user: UserObject = body;
  const userJSON = JSON.stringify(user);
  localStorage.setItem('user', userJSON);
};

/**
 * Wrapper for any registration request. When successful, it saves a token, allowing the use of `fetchWithToken` for later requests.
 *
 * @param user object of the user to be registered
 */
export async function registerAndSaveToken(user: RegisterUserObject) {
  delete user.confirmPassword;
  // Perform request to "/login" with credentials
  const response = await fetch('/auth/register/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  let responseBody: UserAndTokenBody | undefined;
  const contentLength = response.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength)) {
    await response
      .json()
      .then((body: UserAndTokenBody) => {
        responseBody = body;
      })
      .catch(e => {
        console.error('Parsing of body failed');
        console.error(e);
        console.error(response);
      });
  }

  // Retrieve and store token
  if (responseBody) {
    const token = responseBody.token;
    localStorage.setItem('token', token);
    saveUserToLocalStorage(responseBody);
    return response.status;
  }
  return 400;
}

/**
 * Wrapper for any authentication request. When successful, it saves a token, allowing the use of `fetchWithToken` for later requests.
 *
 * @param email email for authentication.
 * @param password the password for the user attempting to authenticate.
 */
export async function signInAndSaveToken(email: string, password: string) {
  // Perform request to "/login" with credentials
  const response = await fetch('/auth/login/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      password,
    }),
  });
  let responseBody: UserAndTokenBody | undefined;
  const contentLength = response.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength)) {
    await response
      .json()
      .then((body: UserAndTokenBody) => {
        responseBody = body;
      })
      .catch(e => {
        console.error('Parsing of body failed');
        console.error(e);
        console.error(response);
      });
  }

  // Retrieve and store token
  if (responseBody) {
    const token = responseBody.token;
    localStorage.setItem('token', token);
    saveUserToLocalStorage(responseBody);
    return response.status;
  }
  return 400;
}

const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};

export function singOutAndDeleteToken() {
  removeUserFromLocalStorage();
  localStorage.removeItem('token');
}
