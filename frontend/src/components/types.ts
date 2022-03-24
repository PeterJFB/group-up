import {UserObject} from '../types/api';
export type RegisterUserObject = UserObject & {confirmPassword?: string};
export type CreateGroupObject = {
  id: number;
  name: string;
  quote: string;
  description: string;
  interests: string;
  location: string;
  meetingDate: string;
  //contactInfo: string;
};
