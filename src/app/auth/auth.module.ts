import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        AngularFireAuthModule
        // AngularFireAuthModule is used in a service, so it could be instead imported in app.module because all services are injected at root
       
    ]
})
export class AuthModule { }