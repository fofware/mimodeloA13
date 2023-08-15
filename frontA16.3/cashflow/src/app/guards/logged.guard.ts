import { CanActivateFn } from '@angular/router';
import { userIsLogged } from '../users/services/users.service';

export const loggedActivateGuard: CanActivateFn = (route, state) => {
  return userIsLogged();
};
