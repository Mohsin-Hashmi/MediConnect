export type UserRoleName = "patient" | "doctor";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleName;
}
