export function validatePassword(password: string): boolean {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}
