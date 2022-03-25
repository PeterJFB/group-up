import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import GroupUpDetail from '../GroupUpDetail';
import {GroupObject, GroupUpObject} from '../../../types/api';
import {MemoryRouter} from 'react-router-dom';

const mock1: GroupObject = {
  id: 0,
  name: 'Gruppe1',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [],
  groupAdmin: 1,
  interests: [{name: 'mocking', description: 'we like to mock'}],
  location: 'Mockingland',
  meetingDate: '2022-10-06',
  contactInfo: 'gruppe1@gmail.com',
};
const mock2: GroupObject = {
  id: 1,
  name: 'Gruppe2',
  quote: 'mockQuote',
  description: 'mocking a description',
  members: [],
  groupAdmin: 2,
  interests: [{name: 'mocking2', description: 'we like to mock'}],
  location: 'Mockingland2',
  meetingDate: '2022-10-06',
  contactInfo: 'andregruppe@gmail.com',
};

const mockGroupUp: GroupUpObject = {
  group1: mock1,
  group2: mock2,
  id: 0,
  plannedDate: '2022-05-20',
};

describe('RegisterForm', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <GroupUpDetail groupUp={mockGroupUp} />
      </MemoryRouter>
    );
  });

  it('should show all text field', async () => {
    expect(screen.queryByText(mock1.name)).toBeInTheDocument();
    expect(screen.queryByText(mock2.name)).toBeInTheDocument();
    expect(screen.queryByText(mock1.location)).toBeInTheDocument();
    expect(screen.queryByText(mock2.location)).toBeInTheDocument();
    expect(screen.queryByText(/You have matched/i)).toBeInTheDocument();
    expect(screen.queryByText(mock1.contactInfo)).toBeInTheDocument();
    expect(screen.queryByText(mock2.contactInfo)).toBeInTheDocument();
    expect(
      screen.queryByText(/The current planned date for meeting is/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Change Date/i)).toBeInTheDocument();
  });
  it('should show the change date form when button is clicked', async () => {
    fireEvent.click(screen.getByText(/Change Date/i));

    expect(await screen.findByTestId('plannedDate')).toBeInTheDocument();
    expect(await screen.findByTestId('cancelButton')).toBeInTheDocument();
    expect(await screen.findByTestId('changeButton')).toBeInTheDocument();
  });
});
