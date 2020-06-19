import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  public authChange = new Subject<boolean>();

  constructor(private router: Router) { }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: `${Math.round(Math.random() * 1000)}`
    }
    this.authSuccess();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: `${Math.round(Math.random() * 1000)}`
    }
    this.authSuccess();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
  }

  getUser() {
    return {...this.user};
    // a clone is return so user can't be changed in other parts of the app, since it's a refernce type;
  }

  isAuth() {
    return this.user != null;
  }

  authSuccess() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
