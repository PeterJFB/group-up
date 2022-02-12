const url = 'localhost:8080'; // TODO: move to environment variable

type TokenBody = {
  token: string;
};

/**
 * The default wrapper for any request after authentication
 *
 * @param endpoint api endpoint
 * @param method e.g. POST, PUT, GET etc.
 * @param body request body
 */
export async function fetchWithToken<ResponseBody>(
  endpoint: string,
  method: string,
  body: any
) {
  const token = localStorage.getItem('token');

  if (!token) {
    return {missingToken: true};
  }

  const response = await fetch(url + endpoint, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body,
  });

  const responseBody: ResponseBody = await response.json();

  return {
    headers: response.headers,
    status: response.status,
    body: responseBody,
    missingToken: false,
  };
}

/**
 * Wrapper for any authentication request. When successful, it saves a token, allowing the use of `fetchWithToken` for later requests
 *
 * @param username username for authentication, i.e. the users email
 * @param password the password for the user attempting to authenticate.
 */
export async function signInAndSaveToken(username: string, password: string) {
  const response = await fetch(url + '/login', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      username,
      password,
    } as any,
  });
  const responseBody: TokenBody = await response.json();

  const token = responseBody.token;

  localStorage.setItem('token', token);

  const validateToken = localStorage.getItem('token');
  if (token !== validateToken) {
    return {
      savedToken: false,
    };
  }

  return {
    headers: response.headers,
    status: response.status,
    token: token,
    savedToken: true,
  };
}
