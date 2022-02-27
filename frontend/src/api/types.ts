// The User with fields corresponding to our database
export type UserObject = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  password: string;
};

export type GroupObject = {
  groupid: number;
  groupname: string;
  groupdesc: string;
  groupmembers: string[];
  interests: string[];
  location: string;
  date: string;
  quote: string;
  //...
};
