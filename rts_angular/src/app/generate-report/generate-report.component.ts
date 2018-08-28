import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ApiUrl } from '../Services/api-url';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css'],
  providers: [LoggedUserService]
})
export class GenerateReportComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private submissions: any;
  private requirements: any;
  private approvedsubmissions: any;
  private rtsCompanyId: any;
  private currentDate: Date;
  private approvedSubmissionsLength: any;
  private userRole: any;
  private baseUrl: any;
  public myForm: FormGroup;
  private startDate: any;
  private toDate: any;
  private isTeam: boolean;
  private isClient: boolean;
  private isRecruiter: boolean;
  private filter: string;
  private clients: any;
  private teams: any;
  private teamUsers: any;
  private selectedSubmissions: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private submissonService: SubmissionService,
    private hideComponent: HideComponentService,
    private formBuilder: FormBuilder,
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
    this.currentDate = new Date();
    this.filter = '';
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });
    const currentDateMoment: moment.Moment = moment(this.currentDate);
    this.startDate = currentDateMoment.subtract(3, 'days').format('YYYY-MM-DD');
    this.getCommonDetails();
    this.getApprovedSubmissions();
    this.baseUrl = ApiUrl.BaseUrl;
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

  filterByDate(form: FormGroup) {

    if (form.value.fromDate !== 'Invalid date' && form.value.fromDate !== '') {
      this.startDate = moment(form.value.fromDate).format('YYYY-MM-DD');
    } else {
      this.startDate = '';
    }
    this.filterBy('');
    this.getApprovedSubmissions();
  }

  filterBy(value) {

    if (value === 'team') {
      this.isTeam = true;
      this.isClient = false;
      this.isRecruiter = false;
    } else if (value === 'client') {
      this.isClient = true;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'recruiter') {
      this.isRecruiter = true;
      this.isTeam = false;
      this.isClient = false;
    } else if (value === '') {
      this.filter = '';
      this.isRecruiter = false;
      this.isTeam = false;
      this.isClient = false;
    }
  }

  selectTeam(event) {
    if (event === 'selectAll') {
      this.selectedSubmissions = this.approvedsubmissions;
      this.selectedSubmissionDetails(this.selectedSubmissions);
    } else {
      this.selectedSubmissions = [];
      this.selectedSubmissions = _.where(this.approvedsubmissions, { teamId: event });
      this.selectedSubmissionDetails(this.selectedSubmissions);
    }
  }

  selectClient(event) {
    if (event === 'selectAll') {
      this.selectedSubmissions = this.approvedsubmissions;
      this.selectedSubmissionDetails(this.selectedSubmissions);
    } else {
      this.selectedSubmissions = [];
      this.selectedSubmissions = _.where(this.approvedsubmissions, { clientId: event });
      this.selectedSubmissionDetails(this.selectedSubmissions);
    }
  }

  selectRecruiter(event) {
    if (event === 'selectAll') {
      this.selectedSubmissions = this.approvedsubmissions;
      this.selectedSubmissionDetails(this.selectedSubmissions);
    } else {
      this.selectedSubmissions = [];
      this.selectedSubmissions = _.where(this.approvedsubmissions, { recruiterId: event });
      this.selectedSubmissionDetails(this.selectedSubmissions);
    }
  }

  getApprovedSubmissions() {

    this.toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      userId: this.rtsUserId,
      fromDate: this.startDate,
      toDate: this.toDate
    };

    this.submissonService.approvedSubmissionDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.submissionDetails(data);
          }
        });
  }

  generateReport() {
    this.toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      userId: this.rtsUserId,
      fromDate: this.startDate,
      toDate: this.toDate
    };

    this.submissonService.getReport(userId)
      .subscribe(
        data => {
          if (data.success) {
            window.open(this.baseUrl + data.downloadUrl, '_blank');
          }
        });

  }

  submissionDetails(data) {
    this.approvedsubmissions = data.submissionReport;
    this.selectedSubmissions = this.approvedsubmissions;
    this.approvedSubmissionsLength = this.selectedSubmissions.length;
    for (const submission of this.approvedsubmissions) {
      const diff = Math.floor(this.currentDate.getTime() - submission.submissionDate);
      const day = 1000 * 60 * 60 * 24;
      const days = Math.floor(diff / day);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (days < 7) {
        submission.age = days + ' days ago';
      } else if (weeks < 4) {
        submission.age = weeks + ' weeks ago';
      } else if (months < 12) {
        submission.age = months + ' months ago';
      } else {
        submission.age = years + ' years ago';
      }
    }
  }

  selectedSubmissionDetails(data) {
    this.selectedSubmissions = data;
    this.approvedSubmissionsLength = this.selectedSubmissions.length;
    for (const submission of this.selectedSubmissions) {
      const diff = Math.floor(this.currentDate.getTime() - submission.submissionDate);
      const day = 1000 * 60 * 60 * 24;
      const days = Math.floor(diff / day);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 31);
      const years = Math.floor(months / 12);
      if (days < 7) {
        submission.age = days + ' days ago';
      } else if (weeks < 4) {
        submission.age = weeks + ' weeks ago';
      } else if (months < 12) {
        submission.age = months + ' months ago';
      } else {
        submission.age = years + ' years ago';
      }
    }
  }
}


