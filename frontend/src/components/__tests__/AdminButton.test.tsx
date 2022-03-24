import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import GroupProfileDetail from '../GroupProfile/GroupProfileDetail';
import {GroupObject, UserObject} from '../../types/api';
class LocalStorageMock {
  private store: Record<string, string>;
  public length: number;
  constructor() {
    this.store = {};
    this.length = 0;
  }

  key() {
    return 'KEY';
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}
const mockedAdmin: UserObject = {
  id: 1,
  username: 'admin',
  first_name: 'admin',
  last_name: 'admin',
  email: 'admin@admin.no',
  birthdate: new Date('2001-10-05'),
  password: 'admin123',
};

const mockedUser: UserObject = {
  id: 2,
  username: 'line',
  first_name: 'line',
  last_name: 'rosland',
  email: 'line@norge.no',
  birthdate: new Date('1999-10-06'),
  password: 'line123',
};

const mockedGroupObject1: GroupObject = {
  id: 0,
  name: 'mock',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [mockedAdmin, mockedUser],
  groupAdmin: 1,
  interests: [{name: 'mocking', description: 'we like to mock'}],
  location: 'Mockingland',
  meetingDate: '2022-10-06',
};
const localStorageMock = new LocalStorageMock();
global.localStorage = localStorageMock;

describe('AdminButton', () => {
  it('should show Add Member button for an groupadmin user', async () => {
    localStorage.setItem('user', JSON.stringify(mockedAdmin));

    render(
      <MemoryRouter>
        <GroupProfileDetail group={mockedGroupObject1} />
      </MemoryRouter>
    );
    const button = screen.queryByText(/Add member/i);

    expect(button).toBeVisible();
  });
  it('should not show Add member button when not admin', async () => {
    localStorage.setItem('user', JSON.stringify(mockedUser));
    render(
      <MemoryRouter>
        <GroupProfileDetail group={mockedGroupObject1} />
      </MemoryRouter>
    );
    const button = screen.queryByText(/Add member/i);

    expect(button).not.toBeVisible();
  });

  it('should show the form when button is clicked', async () => {
    localStorage.setItem('user', JSON.stringify(mockedAdmin));
    render(
      <MemoryRouter>
        <GroupProfileDetail group={mockedGroupObject1} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Add member/i));

    expect(screen.queryByText(/Add new member/i)).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
  });
  it('should check email regex for add new member email field', async () => {
    localStorage.setItem('user', JSON.stringify(mockedAdmin));
    render(
      <MemoryRouter>
        <GroupProfileDetail group={mockedGroupObject1} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Add member/i));

    fireEvent.input(screen.getByRole('textbox', {name: /email/i}), {
      target: {
        value: 'test',
      },
    });

    fireEvent.submit(screen.getByText(/Add new member/i));

    expect(await screen.findByTestId('email-error')).toBeDefined();
    expect(
      (screen.getByRole('textbox', {name: /email/i}) as HTMLInputElement).value
    ).toBe('test');
  });
});
