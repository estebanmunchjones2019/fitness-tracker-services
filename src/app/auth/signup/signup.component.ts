import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('f') seForm: NgForm;
  maxDate: Date;
  isLoading: boolean = false;
  loadingSubs: Subscription;


  constructor(private authService: AuthService,
              private uiService: UiService) {
   }

  ngOnInit(): void {

    this.maxDate = new Date();
    // then I keep the day, but change the year with setFullYear();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingSubs = this.uiService.loading.subscribe(payload => {
      this.isLoading = !this.isLoading;
    })
  }  

  onSubmit(f: NgForm) {
    const authData: AuthData = {
      email: f.value.email,
      password: f.value.password
    }
    this.authService.registerUser(authData);
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}
