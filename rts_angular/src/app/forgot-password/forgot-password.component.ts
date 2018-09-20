import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { HideComponentService } from '../Services/hide-component.service';
import { LoginService } from '../login/login-service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private ngProgress: NgProgress,
    private hideComponent: HideComponentService,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.hideComponent.displayComponent = false;

    this.myForm = this.formBuilder.group({
      email: ['', Validators.email],
    });
  }

  ngOnDestroy() {
    this.hideComponent.displayComponent = true;
  }

  resetPassword(form: FormGroup) {

    if (form.value.email === '' || form.value.email === undefined) {
      this.toastr.error('Email field should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    this.ngProgress.start();

    const email = {
      email: form.value.email
    };

    this.loginService.forgotPassword(email)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.toastr.success('Password reset link sent to your email address', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
          }
        });
  }

}
