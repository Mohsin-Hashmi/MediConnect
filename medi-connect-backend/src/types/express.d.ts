import type { UserRoleName } from "./user.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRoleName;
      };
    }
  }
}

export {};
