
/**
 * - The number of salt rounds to use for bcrypt hashing.
 */
export const BCRYPT_SALT_ROUNDS = 10;

/**
 * - Converts a user document into safe auth response data.
 */
export const formatAuthUser = (user: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: string;
}) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});