export type Interest = {
  name: string;
  description: string;
};

export type UserObject = {
  id: number;
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
  groupAdmin: number;
  interests: Interest[];
  location: string;
  meetingDate: string | Date;
  contactInfo?: string;
};

export type GroupUpObject = {
  id: number;
  group1: number;
  group2: number;
  groupUpAccept?: boolean;
  isSuperGroupup?: boolean;
  plannedDate: string;
};
