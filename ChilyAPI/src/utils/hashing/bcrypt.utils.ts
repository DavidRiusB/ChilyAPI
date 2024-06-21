import * as bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function validateUserPasword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
