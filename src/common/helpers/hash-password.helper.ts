import * as argon2 from 'argon2';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64MB
  timeCost: 3,
  parallelism: 1,
  hashLength: 32,
  saltLength: 16,
};

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await argon2.verify(hashedPassword, password);
}
