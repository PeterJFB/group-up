export type Interest = {
  name: string;
  description: string;
};

export type UserObject = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string | Date;
  password: string;
};

export type GroupObject = {
  id: number;
  name: string;
  quote: string;
  description: string;
  members: UserObject[];
  groupAdmin: UserObject;
  interests: Interest[];
  location: string;
  meetingDate: string | Date;
};

export type GroupUpObject = {
  group1: number;
  group2: number;
  groupUpAccept?: boolean;
  isSuperGroupup?: boolean;
};
