/**
 * - Converts a user document into safe profile response data.
 */
export const formatUserProfile = (user: {
  _id: { toString: () => string };
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  profileImage?: string | null;
  dateOfBirth?: Date | null;
  gender?: string | null;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  profileImage: user.profileImage,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  address: user.address,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});