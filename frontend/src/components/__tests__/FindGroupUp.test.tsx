import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {FindGroupUp} from '../FindGroupUp';
import {MemoryRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import {GroupObject, UserObject} from '../../types/api';

/* eslint-enable @typescript-eslint/no-unused-vars */

const mockUserWithName = (name: string): UserObject => {
  return {
    username: name,
    first_name: name,
    last_name: name,
    email: name,
    birthdate: name,
    password: name,
  };
};

const mockedGroupObject1: GroupObject = {
  id: 0,
  name: 'mock',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [
    mockUserWithName('Anna'),
    mockUserWithName('Ola'),
    mockUserWithName('Jens'),
  ],
  interests: [{name: 'mocking', description: 'we like to mock'}],
  location: 'Mockingland',
  meetingDate: '2020-02-2',
  groupAdmin: mockUserWithName('Jens'),
};

const mockedGroupObject2: GroupObject = {
  id: 1,
  name: 'mock2',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [
    mockUserWithName('Jonas'),
    mockUserWithName('Ola'),
    mockUserWithName('Jens'),
  ],
  interests: [{name: 'mocking', description: 'we like to mock'}],
  location: 'Mockingworld',
  meetingDate: '2020-02-2',
  groupAdmin: mockUserWithName('Jens'),
};

describe('FindGroupUp', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (input: RequestInfo) => {
      if (input.toString().includes('getMyGroups')) {
        return Promise.resolve(
          new Response(JSON.stringify([mockedGroupObject1]), {
            headers: {'Content-Length': '1'},
          })
        );
      }

      if (input.toString().includes('findGroupUp')) {
        if (
          input.toString().includes('location') &&
          !input.toString().includes(mockedGroupObject2.location)
        )
          return Promise.resolve(
            new Response(JSON.stringify([]), {
              headers: {'Content-Length': '1'},
            })
          );
        else
          return Promise.resolve(
            new Response(JSON.stringify([mockedGroupObject2]), {
              headers: {'Content-Length': '1'},
            })
          );
      }
    }) as jest.Mock;

    localStorage.setItem('token', 'token');
  });

  it('should allow a user to select their own group', async () => {
    act(() => {
      render(
        <MemoryRouter>
          <RecoilRoot>
            <FindGroupUp />
          </RecoilRoot>
        </MemoryRouter>
      );
    });
    expect(await screen.findAllByRole('groupListItem')).toHaveLength(1);

    fireEvent.click(await screen.findByText(mockedGroupObject1.name));

    expect(await screen.findByText('Adjust filter')).toBeVisible();
    expect(await screen.findByText(mockedGroupObject1.name)).toBeVisible();

    expect(await screen.findAllByRole('groupListItem')).toHaveLength(1);
  });

  it('should allow a user to filter on potential groupups', async () => {
    act(() => {
      render(
        <MemoryRouter>
          <RecoilRoot>
            <FindGroupUp />
          </RecoilRoot>
        </MemoryRouter>
      );
    });

    fireEvent.click(await screen.findByText(mockedGroupObject1.name));

    expect(await screen.findAllByRole('groupListItem')).toHaveLength(1);

    fireEvent.click(screen.getByText('Adjust filter'));

    fireEvent.input(screen.getByRole('location'), {
      target: {
        value: 'MockingLand',
      },
    });

    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(1);
    });

    fireEvent.click(screen.getByText('Adjust filter'));
    fireEvent.input(screen.getByRole('location'), {
      target: {
        value: mockedGroupObject2.location,
      },
    });

    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(1);
    });

    fireEvent.click(screen.getByText('Adjust filter'));
    fireEvent.input(screen.getByRole('location'), {
      target: {
        value: 'NotMockingland',
      },
    });

    fireEvent.click(screen.getByRole('submit'));
    await waitFor(() => {
      expect.not.objectContaining(screen.getAllByRole('groupListItem'));
    });
    expect(screen.queryByRole('groupListItem')).not.toBeInTheDocument();
  });
});
