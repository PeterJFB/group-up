const {REACT_APP_URL} = process.env;

/**
 * This file consists of a set helper functions, which the frontend will use to communicate
 * with our backend, i.e. participating as a controller to the model.
 */

// Including all for completion sake. https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
type HttpRequestMethod = "POST" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "OPTIONS";

type TokenBody = {
  token: string;
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
) {
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
    headers: response.headers,
    status: response.status,
    body: responseBody,
    missingToken: false,
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
  const response = await fetch(REACT_APP_URL + '/login', {
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

  // Retrieve and store token
  const token = responseBody.token;
  localStorage.setItem('token', token);

  // TODO: return status from an invalid authentication

  // Ensure the token was successfully saved
  const validateToken = localStorage.getItem('token');

  return {
    headers: response.headers,
    status: response.status,
    token: token,
    error: token !== validateToken,
  };
}
