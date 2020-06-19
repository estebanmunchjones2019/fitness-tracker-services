import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('f') seForm: NgForm;
  maxDate: Date;

  constructor(private authService: AuthService) {
   }

  ngOnInit(): void {

    this.maxDate = new Date();
    // then I keep the day, but change the year with setFullYear();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    
  }  

  onSubmit(f: NgForm) {
    const authData: AuthData = {
      email: f.value.email,
      password: f.value.password
    }
    this.authService.registerUser(authData);
  }

}
