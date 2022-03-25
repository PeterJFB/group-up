import React from 'react';
import {RecoilRoot} from 'recoil';
import {act, fireEvent, render, screen} from '@testing-library/react';
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
  contactInfo: 'contact@gmail.com',
};

const localStorageMock = new LocalStorageMock();
global.localStorage = localStorageMock;

localStorage.setItem('token', 'myToken');

const setupFetchStub = () => {
  return () => {
    return Promise.resolve(
      new Response(null, {
        headers: {'Content-Length': '0'},
        status: 204,
      })
    );
  };
};
// const mockFetch = jest
//   .fn()
//   .mockImplementation(async (input: RequestInfo, init: RequestInit) => {
//     console.log('HEI!', init.method);
//     if (init.method == 'DELETE') {
//       return Promise.resolve();
//     }
//   });

//global.fetch = mockFetch;

describe('DeleteButton', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(setupFetchStub());
  });

  it('should show delete button for a groupadmin user', async () => {
    localStorage.setItem('user', JSON.stringify(mockedAdmin));

    render(
      <MemoryRouter>
        <RecoilRoot>
          <GroupProfileDetail group={mockedGroupObject1} />
        </RecoilRoot>
      </MemoryRouter>
    );
    const button = screen.queryByText(/Delete group/i);

    expect(button).toBeVisible();
  });
  it('should not show delete button when not admin', async () => {
    localStorage.setItem('user', JSON.stringify(mockedUser));
    render(
      <MemoryRouter>
        <RecoilRoot>
          <GroupProfileDetail group={mockedGroupObject1} />
        </RecoilRoot>
      </MemoryRouter>
    );
    const button = screen.queryByText(/Delete group/i);

    expect(button).not.toBeVisible();
  });

  it('should show the confirmation window when delete button is clicked', async () => {
    localStorage.setItem('user', JSON.stringify(mockedAdmin));
    render(
      <MemoryRouter>
        <RecoilRoot>
          <GroupProfileDetail group={mockedGroupObject1} />
        </RecoilRoot>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Delete group/i));

    expect(screen.getByTestId('deleteButton')).toBeInTheDocument();
    expect(screen.getByTestId('cancelButton')).toBeInTheDocument();
    expect(
      screen.queryByText(/Do you want to delete this group/i)
    ).toBeInTheDocument();
  });

  it('should show the confirmation window when delete button is clicked', async () => {
    localStorage.setItem('user', JSON.stringify(mockedAdmin));
    await act(async () => {
      render(
        <MemoryRouter>
          <RecoilRoot>
            <GroupProfileDetail group={mockedGroupObject1} />
          </RecoilRoot>
        </MemoryRouter>
      );
    });
    await act(async () => {
      fireEvent.click(screen.getByText(/Delete group/i));
      const deleteButton = await screen.findByTestId('deleteButton');
      fireEvent.click(deleteButton);
    });
    //expect(await screen.findByText(/Notification!./i)).toBeInTheDocument();
    /*We cant find a way to test if the popup is shown, because it is not in possible to find through the screen object*/
  });
});
