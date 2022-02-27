import {UserObject} from '../types/api';
export type RegisterUserObject = UserObject & {confirmPassword: string};
export type CreateGroupObject = {
  groupid: number;
  groupname: string;
  groupdesc: string;
  groupmembers: string[];
  interests: string;
  location: string;
  date: string;
  quote: string;
  //...
};
