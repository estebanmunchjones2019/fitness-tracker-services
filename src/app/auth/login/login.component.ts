import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading: boolean = false;
  loadingSubs: Subscription;

  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadingSubs = this.uiService.loading.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
  }

  initForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }


  onSubmit() {
    const authData: AuthData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.authService.login(authData);
  }

  ngOnDestroy() {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

} 
