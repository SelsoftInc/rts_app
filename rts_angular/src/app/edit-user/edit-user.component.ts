import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [LoggedUserService]
})
export class EditUserComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;
  private userId: any;

  public myForm: FormGroup;
  private userDetails: any;
  private selectedUser: any;
  private firstName: any;
  private lastName: any;
  private email: any;
  private role: any;
  private userRole: string;
  private rtsCompanyId: any;
  private phoneNumber: any;

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userType = [
      { 'name': 'Account Manager', 'value': 'ACC_MGR' },
      { 'name': 'Team Leader', 'value': 'TL' },
      { 'name': 'Recruiter', 'value': 'RECRUITER' },
      // { 'name': 'Trainee', 'value': 'TRAINEE' },
    ];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.userId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      role: [''],
      // tslint:disable-next-line:max-line-length
      phoneNumber: ['', [Validators.maxLength(15), Validators.pattern('^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$')]],
    });

    this.getAllUser();
  }

  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.userDetails = data.users;
            for (const user of this.userDetails) {
              this.selectedUser = _.findWhere(this.userDetails, { userId: this.userId });
            }
            this.firstName = this.selectedUser.firstName;
            this.lastName = this.selectedUser.lastName;
            this.email = this.selectedUser.email;
            this.role = this.selectedUser.role;
            this.phoneNumber = this.selectedUser.phoneNumber;
          }
        });

  }

  updateUser(form: FormGroup) {

    if (this.role === 'ADMIN' && this.userRole === 'ACC_MGR') {
      this.toastr.error('Admin user cannot be modified by Account Manager', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    this.ngProgress.start();

    const editUser = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      role: form.value.role,
      phoneNumber: form.value.phoneNumber,
      enteredBy: this.rtsUserId,
      userId: this.userId
    };

    this.userService.editUser(editUser)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Updated successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
            this.router.navigate(['manage-users']);

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

