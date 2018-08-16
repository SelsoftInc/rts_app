import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RegisterService } from './user-register-service';
import { Router } from '@angular/router';
import { HideComponentService } from '../Services/hide-component.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
  providers: [RegisterService],
})
export class UserRegisterComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private hideComponent: HideComponentService,
    private toastr: ToastrService
  ) {
    this.hideComponent.displayComponent = false;
  }

  ngOnInit() {

    this.hideComponent.displayComponent = false;

    this.myForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      companyAddress1: ['', Validators.required],
      companyAddress2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      companyZipcode: ['', [Validators.required, Validators.pattern('^\\d{5}(?:[-\\s]\\d{4})?$')]],
      companyPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      userEmail: ['', Validators.required],
      userPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnDestroy() {
    this.hideComponent.displayComponent = true;
  }

  register(form: FormGroup) {
    const company = {
      name: form.value.companyName,
      address1: form.value.companyAddress1,
      address2: form.value.companyAddress2,
      city: form.value.city,
      state: form.value.state,
      zipCode: form.value.companyZipcode,
      phoneNumber: form.value.companyPhoneNumber
    };

    const user = {
      firstName: form.value.userFirstName,
      lastName: form.value.userLastName,
      password: form.value.password,
      email: form.value.userEmail,
      phoneNumber: form.value.userPhoneNumber
    };

    const userRegister = {
      company: company,
      adminUser: user
    };

    this.registerService.registerUser(userRegister)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('You are now registered and can log in', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['login']);
          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
