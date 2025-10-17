import { Matches } from 'class-validator';

export function IsStrongPassword(message?: string) {
  return Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/
    , { message: message || 'Password too weak'});
}
