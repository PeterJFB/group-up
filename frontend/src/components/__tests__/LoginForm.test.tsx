import React from 'react';
import {screen, render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
import {MemoryRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import AlertModal from '../AlertModal';
const mockLogin = async (email: string, password: string) =>
  email == 'email@email.com' && password == 'password' ? 200 : 404;

const mockRerender = () => {
  return;
};

describe('LoginForm', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <RecoilRoot>
          <AlertModal />
          <LoginForm rerender={mockRerender} signInAndGetStatus={mockLogin} />
        </RecoilRoot>
      </MemoryRouter>
    );
  });

  it('should display required error for all fields when they are empty', async () => {
    fireEvent.submit(screen.getByText('Log in'));

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    // expect(mockLogin).not.toBeCalled();
  });

  it('should display matching error when email is invalid', async () => {
    fireEvent.input(screen.getByRole('textbox', {name: /email/i}), {
      target: {
        value: 'test',
      },
    });

    fireEvent.submit(screen.getByText('Log in'));

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

    fireEvent.click(screen.getByText('Log in'));

    await waitFor(() => {
      expect(screen.getByText('An error occured!')).toBeInTheDocument();
    });

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

    fireEvent.submit(screen.getByText('Log in'));

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
