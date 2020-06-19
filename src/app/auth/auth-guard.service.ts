import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean 
  |UrlTree
  | Promise<boolean | UrlTree> 
  | Observable<boolean | UrlTree> {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
