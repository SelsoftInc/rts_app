import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login-service';
import { HideComponentService } from '../Services/hide-component.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { SubmissionsComponent } from '../submissions/submissions.component';
import { AdminDashboardComponent } from '../dashboard/admin-dashboard/admin-dashboard.component';
import { AccMgrDashboardComponent } from '../dashboard/acc-mgr-dashboard/acc-mgr-dashboard.component';
import { RecruiterDashboardComponent } from '../dashboard/recruiter-dashboard/recruiter-dashboard.component';
import { RequirementsComponent } from '../requirements/requirements.component';
import { MessagingService } from '../messaging.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;
  hide = true;
  message;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private hideComponent: HideComponentService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private messagingService: MessagingService
  ) {
    this.hideComponent.displayComponent = false;
    localStorage.removeItem('id_token');
    localStorage.removeItem('rts_user');
  }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      userEmail: ['', Validators.required],
      userPassword: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.hideComponent.displayComponent = true;
  }

  login(form: FormGroup) {
    SubmissionsComponent.filterBy = undefined;
    SubmissionsComponent.userDetails = undefined;
    SubmissionsComponent.recruiter = undefined;
    RequirementsComponent.userDetails = undefined;
    RecruiterDashboardComponent.graphData = undefined;
    AdminDashboardComponent.graphData = undefined;
    AccMgrDashboardComponent.graphData = undefined;
    this.toastr.clear();

    const user = {
      email: form.value.userEmail,
      password: form.value.userPassword
    };

    if (user.email === '' || user.email === null || user.password === '' || user.password === null
    ) {
      this.toastr.error('Username and password should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    this.loginService.authenticateUser(user)
      .subscribe(
        data => {
          if (data.success) {
            this.loginService.storeUserData(data.token, data.user);
            this.toastr.success('You are now logged in', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            if (data.user.role === 'ADMIN') {
              this.router.navigate(['admin-dashboard']);
            } else if (data.user.role === 'ACC_MGR' || data.user.role === 'TL') {
              this.router.navigate(['mgr-dashboard']);
            } else if (data.user.role === 'RECRUITER') {
              this.router.navigate(['recruiter-dashboard']);
            } else if (data.user.role === 'HR_MANAGER') {
              this.router.navigate(['joining-date']);
            }

            const userId = data.user.userId;
            this.messagingService.requestPermission(userId);
            this.messagingService.receiveMessage();
            this.message = this.messagingService.currentMessage;
          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
