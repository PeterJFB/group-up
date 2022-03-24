import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import RegisterForm from '../RegisterForm';

import {RegisterUserObject} from '../types';
const mockLogin = jest.fn((values: RegisterUserObject) => {
  return Promise.resolve(values.username.length);
});

describe('RegisterForm', () => {
  beforeEach(() => {
    render(<RegisterForm registerAndGetStatus={mockLogin} />);
  });
  //TODO: test navigation to home screen

  it('should display required error for all fields when they are empty', async () => {
    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findAllByRole('alert')).toHaveLength(6);
    expect(mockLogin).not.toBeCalled();
  });

  it('should display matching error when email is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', {name: /email/i}), {
      target: {
        value: 'test',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findByTestId('email-error')).toBeDefined();
    expect(mockLogin).not.toBeCalled();
    expect(
      (screen.getByRole('textbox', {name: /email/i}) as HTMLInputElement).value
    ).toBe('test');
  });

  it('should display error when password is too short', async () => {
    fireEvent.input(await screen.findByTestId('password'), {
      target: {
        value: 'not5',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findByTestId('password-error')).toBeDefined();
    expect(mockLogin).not.toBeCalled();
  });
  it('should display error when username is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', {name: /username/i}), {
      target: {
        value: '&&!!',
      },
    });
    fireEvent.submit(screen.getByRole('button'));
    expect(await screen.findByTestId('username-error')).toBeDefined();
    expect(mockLogin).not.toBeCalled();
  });

  it('should display error when first_name is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', {name: /First name/i}), {
      target: {
        value: '123456789',
      },
    });
    fireEvent.submit(screen.getByRole('button'));
    expect(await screen.findByTestId('first_name-error')).toBeDefined();
    expect(mockLogin).not.toBeCalled();
  });

  it('should display error when last_name is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', {name: /Last name/i}), {
      target: {
        value: '123456789',
      },
    });
    fireEvent.submit(screen.getByRole('button'));
    expect(await screen.findByTestId('last_name-error')).toBeDefined();
    expect(mockLogin).not.toBeCalled();
  });

  it('should display error when passwords are not equal', async () => {
    fireEvent.input(await screen.findByTestId('password'), {
      target: {
        value: 'validPassword',
      },
    });

    fireEvent.input(await screen.findByTestId('confirmPassword'), {
      target: {
        value: 'otherPassword',
      },
    });

    fireEvent.submit(screen.getByRole('button'));

    expect(await screen.findByTestId('confirmPassword-error')).toBeDefined();
    expect(mockLogin).not.toBeCalled();
  });
});
