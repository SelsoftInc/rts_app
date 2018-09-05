import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TeamService } from '../Services/team.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
  providers: [LoggedUserService]
})
export class AddTeamComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;

  public myForm: FormGroup;
  private users: any;
  private teamMembers: any;
  private dropdownSettings: any;
  private isCheck: boolean;
  private leadUsers: any;
  private recruiters: any;
  private accountManager: any;
  private rtsCompanyId: any;
  private recruitersArray: any;

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.teamMembers = [];
    this.recruitersArray = [];
    this.leadUsers = [];
    this.recruiters = [];
    this.accountManager = [];
    this.dropdownSettings = {};
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      teamName: [''],
      accountManager: [''],
      teamLeadUser: [''],
      teamMembers: [''],
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user',
      textField: 'firstName',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
            this.users = data.users;
            for (const user of this.users) {
              if (user.role === 'TL') {
                this.leadUsers.push(user);
              }
              if (user.role === 'ACC_MGR') {
                this.accountManager.push(user);
              }
            }
          }
        });
  }

  selectTeamLead(event) {
    this.recruiters = [];
    this.teamMembers = [];
    for (const user of this.users) {
      if (user.role === 'RECRUITER' || user.role === 'TRAINEE') {
        this.recruiters.push({ user: user.userId, firstName: user.firstName + ' ' + user.lastName });
      }
    }
    this.deSelectAll();
  }

  deSelectAll() {
    this.myForm.controls.teamMembers.setValue('');
  }

  addNewTeam(form: FormGroup) {

    this.teamMembers = [];
    for (const recruiter of this.recruitersArray) {
      this.teamMembers.push(recruiter.user);
    }

    const team = {
      teamName: form.value.teamName,
      leadUserId: form.value.teamLeadUser,
      otherUsers: this.teamMembers,
      accountManagerId: form.value.accountManager
    };

    this.teamService.addTeam(team)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('New Team successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['manage-team']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
