export type UserRoleName = "patient" | "doctor" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleName;
}
