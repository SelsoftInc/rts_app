import { Component, DoCheck } from '@angular/core';
import { LoggedUserService } from './Services/logged-user.service';
import { HideComponentService } from './Services/hide-component.service';
import { Router } from '@angular/router';
import { LoginService } from './login/login-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoggedUserService]
})
export class AppComponent implements DoCheck {
  displayComponent: boolean;
  rtsUser: any;
  userRole: any;

  constructor(private loggedUser: LoggedUserService,
    private hideComponent: HideComponentService,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {
    this.displayComponent = this.hideComponent.displayComponent;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
  }

  ngDoCheck() {
    this.displayComponent = this.hideComponent.displayComponent;
    this.rtsUser = JSON.parse(localStorage.getItem('rts_user'));
    if (this.rtsUser) {
      this.userRole = this.rtsUser.role;
    }

  }

  onLogout() {
    this.loginService.logout();
    this.toastr.success('You are logged out', '', {
      positionClass: 'toast-top-center',
      timeOut: 3000,
    });
    return false;
  }
}
