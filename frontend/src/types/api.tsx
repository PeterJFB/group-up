export type Interest = {
  name: string;
  description: string;
};

export type UserObject = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  password: string;
};

export type GroupType = {
  name: string;
  description: string;
  members: UserObject[];
  groupAdmin: UserObject;
  interests: Interest[];
  location: string;
  quote: string;
  meetingDate: string;
};
