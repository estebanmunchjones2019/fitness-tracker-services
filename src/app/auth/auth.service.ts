import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth} from '@angular/fire/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User;
  
  private isAuthenticated: boolean = false;
  public initAuthListenerSubs: Subscription;
  

  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private uiService: UiService) { }

  initAuthListener() {
    this.initAuthListenerSubs = this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.uiService.authChange.next(true);
        this.uiService.loading.next();
        this.router.navigate(['/training']);
      } else {
        this.user = null;
        this.uiService.authChange.next(false);
      }
    })
  }

  cancelAuthListenerSubs() {
    if (this.initAuthListenerSubs) {
      this.initAuthListenerSubs.unsubscribe();
    }
  }

  registerUser(authData: AuthData) {
    this.uiService.loading.next();
    this.fireAuth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then(user => {
    })
    .catch(error => {
      this.uiService.loading.next();
      this.uiService.openSnackBar(error.message);
    })
  }

  login(authData: AuthData) {
    this.uiService.loading.next();
    this.fireAuth.signInWithEmailAndPassword(authData.email, authData.password) 
    .then(user => {
    })
    .catch(error => {
      this.uiService.loading.next();
      this.uiService.openSnackBar(error.message);
    }) 
  } 

  

  logout() {
    this.fireAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
