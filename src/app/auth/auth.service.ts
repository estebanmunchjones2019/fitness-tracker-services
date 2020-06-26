import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth} from '@angular/fire/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isAuthenticated: boolean = false;
  public initAuthListenerSubs: Subscription;
  

  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private uiService: UiService,
              private trainingService: TrainingService) { }

  initAuthListener() {
    this.initAuthListenerSubs = this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.uiService.authChange.next(true);
        this.uiService.loading.next(false);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelExercisesSubs();
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
    this.uiService.loading.next(true);
    this.fireAuth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then(user => {
    })
    .catch(error => {
      this.uiService.loading.next(false);
      this.uiService.openSnackBar(error.message);
    })
  }

  login(authData: AuthData) {
    this.uiService.loading.next(true);
    this.fireAuth.signInWithEmailAndPassword(authData.email, authData.password) 
    .then(user => {
    })
    .catch(error => {
      this.uiService.loading.next(false);
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
