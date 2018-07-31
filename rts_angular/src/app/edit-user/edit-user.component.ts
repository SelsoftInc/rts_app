import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';

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

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userType = [
      // { 'name': 'Manager', 'value': 'MGR' },
      { 'name': 'Team Leader', 'value': 'TL' },
      { 'name': 'User', 'value': 'USER' },
      { 'name': 'Recruiter', 'value': 'RECRUITER' },
    ];
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.userId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.getAllUser();
  }

  getAllUser() {
    const userId = {
      enteredBy: this.rtsUserId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.userDetails = data.users;
            for (const user of this.userDetails) {
              this.selectedUser = _.findWhere(this.userDetails, { userId: this.userId });
            }
            console.log(this.selectedUser);
            this.firstName = this.selectedUser.firstName;
            this.lastName = this.selectedUser.lastName;
            this.email = this.selectedUser.email;
            this.role = this.selectedUser.role;
          }
        });

  }

  updateUser(form: FormGroup) {
    console.log(form.value);
  }

}
