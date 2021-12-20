import bcrypt from "bcrypt";

const DEFAULT_SALT_ROUNDS = 10;

export const hash = async (string, saltRound = DEFAULT_SALT_ROUNDS) => {
  if (!string) return null;
  const hash = await bcrypt.hash(string, saltRound);
  return hash;
};

export const bcryptCompare = async (string, hash) => {
  const isMatched = await bcrypt.compare(string, hash);
  return isMatched;
};
