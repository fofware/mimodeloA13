import { CanActivateFn } from '@angular/router';
import { userIsLogged, userLogged } from '../users/services/users.service';

export const loggedMatchGuard: CanActivateFn = (route, state) => {
  console.log('route',route)
  console.log('state',state)
  console.log(userLogged())
  return userIsLogged();
};
