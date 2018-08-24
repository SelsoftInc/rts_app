import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import * as moment from 'moment';
import { HideComponentService } from '../Services/hide-component.service';
import * as _ from 'underscore';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
  providers: [LoggedUserService]
})
export class RequirementsComponent implements OnInit {
  private rtsUser: any;
  private rtsUserId: any;
  private requirements: any;
  private createdOn: any;
  private requirementsLength: any;
  private userRole: any;
  private requirementsForUser: any;
  private requirementsLengthForUser: any;
  private rtsCompanyId: any;
  private currentDate: Date;
  private requirementsForTeam: any;
  private requirementsLengthForTeam: any;
  private submittedRequirements: any;

  public myForm: FormGroup;
  private fromDate: any;
  private toDate: any;
  private isStatus: boolean;
  private isTeam: boolean;
  private isClient: boolean;
  private requirementStatus: any;
  private teams: any;
  private clients: any;
  private isRecruiter: boolean;
  private userDetails: any;
  private teamUsers: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.fromDate = '';
    this.toDate = '';
    this.currentDate = new Date();
    this.submittedRequirements = [];
    this.teamUsers = [];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'Open' },
      { 'name': 'In-Progress', 'value': 'In-Progress' },
      { 'name': 'Closed', 'value': 'Closed' },
      { 'name': 'Draft', 'value': 'Draft' }
    ];
  }

  ngOnInit() {
    this.hideComponent.displayComponent = true;

    this.myForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });
    this.getCommonDetails();
    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER') {
      this.getAllRequirementsForUser();
    }
  }

  filterBy(value) {

    if (value === 'status') {
      this.isStatus = true;
      this.isClient = false;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'team') {
      this.isTeam = true;
      this.isStatus = false;
      this.isClient = false;
      this.isRecruiter = false;
    } else if (value === 'client') {
      this.isClient = true;
      this.isStatus = false;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'recruiter') {
      this.isRecruiter = true;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
    } else if (value === '') {
      this.isRecruiter = false;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
    }

    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER') {
      this.getAllRequirementsForUser();
    }

  }

  selectStatus(event) {

    this.fromDate = moment(this.myForm.controls.fromDate.value).format('YYYY-MM-DD');
    this.toDate = moment(this.myForm.controls.toDate.value).format('YYYY-MM-DD');

    if (this.fromDate === 'Invalid date' || this.toDate === 'Invalid date') {
      this.fromDate = '';
      this.toDate = '';
    }
    const userId = {
      status: event,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.requirementService.requirementsDetailsForStatus(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  selectTeam(event) {

    this.fromDate = moment(this.myForm.controls.fromDate.value).format('YYYY-MM-DD');
    this.toDate = moment(this.myForm.controls.toDate.value).format('YYYY-MM-DD');

    if (this.fromDate === 'Invalid date' || this.toDate === 'Invalid date') {
      this.fromDate = '';
      this.toDate = '';
    }

    const userId = {
      teamId: event,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.requirementService.requirementsDetailsForTeam(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  selectClient(event) {

    this.fromDate = moment(this.myForm.controls.fromDate.value).format('YYYY-MM-DD');
    this.toDate = moment(this.myForm.controls.toDate.value).format('YYYY-MM-DD');

    if (this.fromDate === 'Invalid date' || this.toDate === 'Invalid date') {
      this.fromDate = '';
      this.toDate = '';
    }

    const userId = {
      clientId: event,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.requirementService.requirementsDetailsForClient(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  selectRecruiter(event) {

    this.fromDate = moment(this.myForm.controls.fromDate.value).format('YYYY-MM-DD');
    this.toDate = moment(this.myForm.controls.toDate.value).format('YYYY-MM-DD');

    if (this.fromDate === 'Invalid date' || this.toDate === 'Invalid date') {
      this.fromDate = '';
      this.toDate = '';
    }

    const userId = {
      userId: event,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.requirementService.requirementsDetailsForRecruiter(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.clients = data.clients;
            this.teams = data.teams;
            this.teamUsers = data.myTeamUser;
          }
        });
  }

  getAllRequirements() {

    const userId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getAllRequirementsForUser() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getAllRequirementsForTeam() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsByTeam(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  requirementsDetails(data) {
    this.requirements = data.requirements;
    this.requirementsLength = this.requirements.length;
    for (const require of this.requirements) {
      const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
      const day = 1000 * 60 * 60 * 24;
      const days = Math.floor(diff / day);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (days < 7) {
        require.age = days + ' days ago';
      } else if (weeks < 4) {
        require.age = weeks + ' weeks ago';
      } else if (months < 12) {
        require.age = months + ' months ago';
      } else {
        require.age = years + ' years ago';
      }
    }
  }

}
