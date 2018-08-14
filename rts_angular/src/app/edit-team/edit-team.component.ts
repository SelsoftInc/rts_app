import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { TeamService } from '../Services/team.service';
import { RequirementsService } from '../Services/requirements.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css'],
  providers: [LoggedUserService]
})
export class EditTeamComponent implements OnInit {


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
  private teamId: any;
  private teams: any;
  private teamName: any;
  private accountManagerName: any;
  private teamLeadName: any;
  private selectedTeam: any;
  private recruitersArray: any;

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private teamService: TeamService,
    private requirementService: RequirementsService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.teamMembers = [];
    this.leadUsers = [];
    this.recruiters = [];
    this.recruitersArray = [];
    this.accountManager = [];
    this.dropdownSettings = {};
  }

  ngOnInit() {

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.teamId = params['id'];
      });

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
    this.getCommonDetails();
  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.teams = data.teams;
            this.selectedTeam = _.findWhere(this.teams, { teamId: this.teamId });
            this.teamName = this.selectedTeam.name;
            this.accountManagerName = this.selectedTeam.accountManager.userId;
            this.teamLeadName = this.selectedTeam.leadUser.userId;
            this.selectTeamLead();
            this.recruitersArray = [];
            for (const recruiter of this.selectedTeam.otherUsers) {
              this.recruitersArray.push({ user: recruiter.userId, firstName: recruiter.firstName + ' ' + recruiter.lastName });
            }
          }
        });
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

  selectTeamLead() {
    this.recruiters = [];
    this.teamMembers = [];
    for (const user of this.users) {
      if (user.role === 'RECRUITER') {
        this.recruiters.push({ user: user.userId, firstName: user.firstName + ' ' + user.lastName });
      }
    }
    this.deSelectAll();
  }

  deSelectAll() {
    this.myForm.controls.teamMembers.setValue('');
  }

  updateTeam(form: FormGroup) {

    this.teamMembers = [];
    for (const recruiter of this.recruitersArray) {
      this.teamMembers.push(recruiter.user);
    }

    const team = {
      teamName: form.value.teamName,
      leadUserId: form.value.teamLeadUser,
      otherUsers: this.teamMembers,
      accountManagerId: form.value.accountManager,
      teamId: this.teamId
    };

    this.teamService.editTeam(team)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Team Updateted successfully', '', {
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
