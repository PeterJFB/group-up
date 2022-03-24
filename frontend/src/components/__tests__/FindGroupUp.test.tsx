import React, {useEffect} from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {FindGroupUp} from '../FindGroupUp';
import {MemoryRouter} from 'react-router-dom';
import {RecoilRoot, useSetRecoilState} from 'recoil';
import {GroupObject, UserObject} from '../../types/api';
import Header from '../Header';
import {confettiState} from '../../state';

/* eslint-enable @typescript-eslint/no-unused-vars */

// Prevent unrelated errors as the tests run in console
export const DisableConfetti: React.FC = ({children}) => {
  const setConfetti = useSetRecoilState(confettiState);
  useEffect(() => {
    setConfetti({
      active: false,
    });
  }, []);
  return <>{children}</>;
};

const mockUserWithName = (name: string): UserObject => {
  return {
    id: 0,
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
  groupAdmin: 0,
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
  groupAdmin: 0,
};

describe('FindGroupUp', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (input: RequestInfo, init: RequestInit) => {
      if (input.toString().includes('getAges')) {
        return Promise.resolve(
          new Response(JSON.stringify([21]), {
            headers: {'Content-Length': '1'},
          })
        );
      }
      if (input.toString().includes('getMyGroups')) {
        return Promise.resolve(
          new Response(
            JSON.stringify([mockedGroupObject1, mockedGroupObject2]),
            {
              headers: {'Content-Length': '1'},
            }
          )
        );
      }

      if (input.toString().includes('findGroupUp')) {
        const mockedGroupObject = input.toString().includes('/0/')
          ? mockedGroupObject2
          : mockedGroupObject1;

        if (
          input.toString().includes('location') &&
          !input.toString().includes(mockedGroupObject.location)
        )
          return Promise.resolve(
            new Response(JSON.stringify([]), {
              headers: {'Content-Length': '1'},
            })
          );
        else
          return Promise.resolve(
            new Response(JSON.stringify([mockedGroupObject]), {
              headers: {'Content-Length': '1'},
            })
          );
      }

      if (input.toString().includes('groupups')) {
        if (init.body) {
          const body = JSON.parse(init.body as string);
          if (body?.group1 === 0) {
            return Promise.resolve(
              new Response(JSON.stringify({group1: 0, group2: 1}), {
                headers: {'Content-Length': '1'},
              })
            );
          }
          return Promise.resolve(
            new Response(
              JSON.stringify({
                group1: 0,
                group2: 1,
                groupUpAccept: true,
                isSuperGroupup: body?.isSuperGroupup,
              }),
              {
                headers: {'Content-Length': '1'},
              }
            )
          );
        }
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
    expect(await screen.findAllByRole('groupListItem')).toHaveLength(2);

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

    expect(await screen.findAllByRole('groupListItem')).toHaveLength(2);

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

  it('should inform two users when they group up', async () => {
    // Disable canvas
    await act(async () => {
      render(
        <MemoryRouter>
          <RecoilRoot>
            <DisableConfetti>
              <Header />
              <FindGroupUp />
            </DisableConfetti>
          </RecoilRoot>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(2);
    });

    // Perform a GroupUp with first group
    fireEvent.click(await screen.findByText(mockedGroupObject1.name));

    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(1);
    });

    fireEvent.click(await screen.findByText(mockedGroupObject2.name));

    fireEvent.click(screen.getByText('GroupUp'));

    await waitFor(() => {
      expect.not.objectContaining(screen.getAllByRole('groupListItem'));
    });

    // Return and do the same for the second group
    fireEvent.click(await screen.findByRole('returnButton'));

    fireEvent.click(await screen.findByText(mockedGroupObject2.name));
    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(1);
    });

    fireEvent.click(await screen.findByText(mockedGroupObject1.name));

    fireEvent.click(screen.getByText('GroupUp'));

    await waitFor(() => {
      expect(screen.getByText('Congratulations!')).toBeInTheDocument();
    });
  });

  it('should inform two users when they supergroup up', async () => {
    // Disable canvas
    await act(async () => {
      render(
        <MemoryRouter>
          <RecoilRoot>
            <DisableConfetti>
              <Header />
              <FindGroupUp />
            </DisableConfetti>
          </RecoilRoot>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(2);
    });

    // Perform a GroupUp with first group
    fireEvent.click(await screen.findByText(mockedGroupObject1.name));

    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(1);
    });

    fireEvent.click(await screen.findByText(mockedGroupObject2.name));

    fireEvent.click(screen.getByText('GroupUp'));

    await waitFor(() => {
      expect.not.objectContaining(screen.getAllByRole('groupListItem'));
    });

    // Return and do the same for the second group
    fireEvent.click(await screen.findByRole('returnButton'));

    fireEvent.click(await screen.findByText(mockedGroupObject2.name));
    await waitFor(() => {
      expect(screen.getAllByRole('groupListItem')).toHaveLength(1);
    });

    fireEvent.click(await screen.findByText(mockedGroupObject1.name));

    fireEvent.click(screen.getByText('SuperGroupUp'));

    await waitFor(() => {
      expect(screen.getByText(/SuperGrouped/i)).toBeInTheDocument();
    });
  });
});
