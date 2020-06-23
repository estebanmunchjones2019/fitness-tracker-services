import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Route, CanLoad, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanLoad {

  constructor(private authService: AuthService,
              private router: Router) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  // boolean 
  // |UrlTree
  // | Promise<boolean | UrlTree> 
  // | Observable<boolean | UrlTree> {
  //   const isAuth = this.authService.isAuth();
  //   if (isAuth) {
  //     return true;
  //   } else {
  //     return this.router.createUrlTree(['/login']);
  //   }
  // }

  canLoad(route: Route): 
  boolean 
  | Promise<boolean> 
  | Observable<boolean> {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return true;
    } else {
      this.router.navigate(['/login']);
      // return this.router.createUrlTree(['/login']); UrlTree can't be used
    }
  }
} 
