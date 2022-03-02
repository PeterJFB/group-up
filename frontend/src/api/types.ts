import {Interest} from '../types/api';

// The User with fields corresponding to our database
export type UserObject = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: Date;
  password: string;
};

export type GroupObject = {
  id: number;
  name: string;
  quote: string;
  description: string;
  members: string[];
  interests: Interest[];
  location: string;
  date: string;
  //...
};
