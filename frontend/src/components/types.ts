import {UserObject} from '../api/types';
export type RegisterUserObject = UserObject & {confirmPassword: string};
