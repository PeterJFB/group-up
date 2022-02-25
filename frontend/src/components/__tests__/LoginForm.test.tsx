import React from 'react';
import {screen, render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
const mockLogin = async (email: string, password: string) =>
  email == 'email@email.com' && password == 'password' ? 200 : 404;

describe('RegisterForm', () => {
  beforeEach(() => {
    render(<LoginForm signInAndGetStatus={mockLogin} />);
  });

  it('should display required error for all fields when they are empty', async () => {
    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    // expect(mockLogin).not.toBeCalled();
  });

  it('should display matching error when email is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', {name: /email/i}), {
      target: {
        value: 'test',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findByTestId('email-error')).toBeDefined();
    // expect(mockLogin).not.toBeCalled();
    expect(
      (screen.getByRole('textbox', {name: /email/i}) as HTMLInputElement).value
    ).toBe('test');
  });

  it('should display error when password and username combo is wrong', async () => {
    fireEvent.input(await screen.findByTestId('password'), {
      target: {
        value: 'wrongpassword',
      },
    });

    fireEvent.input(screen.getByRole('textbox', {name: /email/i}), {
      target: {
        value: 'wrongemail@email.com',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findByTestId('wrongPassword-error')).toBeDefined();
    // expect(mockLogin).toBeCalled();
  });

  it('should not show any error messages when login is correct', async () => {
    fireEvent.input(await screen.findByTestId('password'), {
      target: {
        value: 'password',
      },
    });

    fireEvent.input(screen.getByRole('textbox', {name: /email/i}), {
      target: {
        value: 'email@email.com',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    expect(
      (screen.getByRole('textbox', {name: /email/i}) as HTMLInputElement).value
    ).toBe('email@email.com');

    expect(
      ((await screen.findByTestId('password')) as HTMLInputElement).value
    ).toBe('password');

    expect;
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    // expect(mockLogin).toBeCalled();
  });
});
