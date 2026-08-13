import type { JwtPayload } from "jsonwebtoken";

import type { UserRoleName } from "./user.js";

export interface UserTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRoleName;
}
