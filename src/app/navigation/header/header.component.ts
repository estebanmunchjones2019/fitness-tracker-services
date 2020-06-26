import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggled = new EventEmitter<void>();
  isAuth: boolean = false;
  authSubs: Subscription;
  
  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit(): void {
    this.authSubs = this.uiService.authChange.subscribe(authState => {
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
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSubs) {
      this.authSubs.unsubscribe();
    }
  } 

}
