type TokenObject = {
  token: string;
};

type AuthenticationBody =
  | {
      username: string;
      password: string;
    }
  | {
      token: string;
    };

type RegisterApi = (
  username: string,
  password: string,
  success: (successObject: TokenObject) => void,
  fail: (entry: any) => void
) => void;

type LoginApi = (
  username: string,
  password: string,
  success: (successObject: TokenObject) => void,
  fail: (entry: string) => void
) => void;

export const register: RegisterApi = async (
  username,
  password,
  success,
  fail
) => {
  const response = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const text = await response.text();

  if (response.status === 200) {
    console.log('success', JSON.parse(text));
    const tokenObject: TokenObject = JSON.parse(text);

    localStorage.setItem('token', tokenObject.token);

    success(JSON.parse(text));
  } else {
    console.log('failed', text);
    Object.entries(JSON.parse(text)).forEach(([key, value]) => {
      fail(`${key}: ${value}`);
    });
  }
};

export const login: LoginApi = async (username, password, success, fail) => {
  const token = localStorage.getItem('token');

  const requestBody: AuthenticationBody = token
    ? {token}
    : {username, password};

  const response = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const text = await response.text();

  if (response.status === 200) {
    success(JSON.parse(text));
  } else {
    console.error('failed', text);
    fail(JSON.parse(text));
  }
};
