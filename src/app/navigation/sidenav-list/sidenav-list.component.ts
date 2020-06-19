import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
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
    this.toggleSidenav();
  }

  ngOnDestroy() {
     this.authSubs.unsubscribe(); 
  }

}
