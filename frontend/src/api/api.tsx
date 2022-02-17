const {REACT_APP_URL} = process.env;

/**
 * This file consists of a set helper functions, which the frontend will use to communicate
 * with our backend, i.e. participating as a controller to the model.
 */

// Including all for completion sake. https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
type HttpRequestMethod =
  | 'POST'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'TRACE'
  | 'OPTIONS';

type TokenBody = {
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
      body: responseBody;
    };

// The User with fields corresponding to our database
type UserObject = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  password: string;
};

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
  body: Record<string, unknown> | string
): Promise<fetchWithTokenResponse<ResponseBody>> {
  const token = localStorage.getItem('token');

  // Do not perform the request is the token is missing
  if (!token) {
    return {missingToken: true};
  }

  // Perform request to backend with token
  const response = await fetch(REACT_APP_URL + endpoint, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(body),
  });

  // Return response
  const responseBody: ResponseBody = await response.json();
  return {
    missingToken: !token,
    headers: response.headers,
    status: response.status,
    body: responseBody,
  };
}

/**
 * Wrapper for any registration request. When successful, it saves a token, allowing the use of `fetchWithToken` for later requests.
 *
 * @param user object of the user to be registered
 */
export async function registerAndSaveToken(user: UserObject) {
  // Perform request to "/login" with credentials
  const response = await fetch(REACT_APP_URL + '/auth/register', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const responseBody: TokenBody = await response.json();

  // TODO: return status from an invalid registration

  // Retrieve and store token
  const token = responseBody.token;
  localStorage.setItem('token', token);

  return {
    headers: response.headers,
    status: response.status,
    token: token,
  };
}

/**
 * Wrapper for any authentication request. When successful, it saves a token, allowing the use of `fetchWithToken` for later requests.
 *
 * @param username username for authentication, i.e. the users email
 * @param password the password for the user attempting to authenticate.
 */
export async function signInAndSaveToken(username: string, password: string) {
  // Perform request to "/login" with credentials
  const response = await fetch(REACT_APP_URL + '/auth/login', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const responseBody: TokenBody = await response.json();

  // TODO: return status from an invalid authentication

  // Retrieve and store token
  const token = responseBody.token;
  localStorage.setItem('token', token);

  return {
    headers: response.headers,
    status: response.status,
    token: token,
  };
}