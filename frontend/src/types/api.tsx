export type Interest = {
  name: string;
  description: string;
};

export type UserObject = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  password: string;
};

export type GroupType = {
  name: string;
  quote: string;
  description: string;
  members: UserObject[];
  groupAdmin: UserObject;
  interests: Interest[];
  location: string;
  meetingDate: string;
};
