export type UserRoleName = "patient" | "doctor" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  authVersion: number;
  role: UserRoleName;
  phone?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
