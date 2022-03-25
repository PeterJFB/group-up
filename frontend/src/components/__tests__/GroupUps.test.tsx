import React from 'react';
import {act, render, screen} from '@testing-library/react';
import {GroupUpListItem} from '../GroupUps/GroupUpListItem';
import {MemoryRouter} from 'react-router-dom';
import {GroupObject, GroupUpObject} from '../../types/api';

const mockedGroupObject1: GroupObject = {
  id: 0,
  name: 'mock',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [],
  interests: [{name: 'mocking', description: 'we like to mock'}],
  location: 'Mockingland',
  meetingDate: '2020-02-2',
  contactInfo: 'contact@gmail.com',
  groupAdmin: 0,
};

const mockedGroupObject2: GroupObject = {
  id: 1,
  name: 'mock2',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [],
  interests: [{name: 'mocking', description: 'we like to mock'}],
  location: 'Mockingworld',
  meetingDate: '2020-02-2',
  contactInfo: 'contact@gmail.com',
  groupAdmin: 0,
};

const mockedGroupUp: GroupUpObject = {
  id: 0,
  plannedDate: '2023-10-05',
  group1: mockedGroupObject1,
  group2: mockedGroupObject2,
};

describe('GroupUps', () => {
  it('should allow user to see a groupup', async () => {
    act(() => {
      render(
        <MemoryRouter>
          <GroupUpListItem groupUp={mockedGroupUp} />
        </MemoryRouter>
      );
    });
    expect(await screen.findAllByRole('groupUpListItem')).toHaveLength(1);
    expect(await screen.findByText(mockedGroupObject1.name)).toBeVisible();
    expect(await screen.findByText(mockedGroupObject2.name)).toBeVisible();
  });
});
