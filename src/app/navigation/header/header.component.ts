import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggled = new EventEmitter<void>();
  isAuth: boolean = false;
  authSubs: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubs = this.authService.authChange.subscribe(authState => {
      if (authState) {
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    })
  }

  toggleSidenav() {
    this.sidenavToggled.emit();
  }

  onLogout() {
    this.isAuth = false;
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  } 

}
