import { Router } from "@angular/router"
import { userIsLogged } from "../services/users.service"
import { inject } from "@angular/core"

export const notLoggedGuard = () => {
  const router = inject(Router)
  return !userIsLogged() ? true : router.navigate(['nopage']);
}