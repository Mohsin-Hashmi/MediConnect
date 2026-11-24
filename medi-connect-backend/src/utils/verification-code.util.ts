import { randomInt } from "node:crypto";

const SIX_DIGIT_CODE_MINIMUM = 100_000;
const SIX_DIGIT_CODE_MAXIMUM_EXCLUSIVE = 1_000_000;

/** Generates a cryptographically secure six-digit verification code. */
export const generateSixDigitVerificationCode = () =>
  randomInt(SIX_DIGIT_CODE_MINIMUM, SIX_DIGIT_CODE_MAXIMUM_EXCLUSIVE).toString();
