import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ApiUrl } from '../Services/api-url';
import { FormGroup, FormBuilder } from '@angular/forms';
import { saveAs } from 'file-saver/FileSaver';
import * as XLSX from 'xlsx';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

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
  private startDate: Date;
  private isTeam: boolean;
  private isClient: boolean;
  private isRecruiter: boolean;
  private filter: string;
  private clients: any;
  private teams: any;
  private teamUsers: any;
  private selectedSubmissions: any;
  private selectedReport: any;
  private sortedData: any;
  // tslint:disable-next-line:member-ordering
  public static userDetails: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private submissonService: SubmissionService,
    private hideComponent: HideComponentService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
    this.currentDate = new Date();
    this.startDate = new Date();
    this.filter = '';
    this.selectedReport = [];
  }

  ngOnInit() {
    this.ngProgress.start();
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

  filterByDate() {
    GenerateReportComponent.userDetails = undefined;
    this.ngProgress.start();
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
    // this.getApprovedSubmissions();
    this.selectedSubmissionDetails(this.approvedsubmissions);
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
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (GenerateReportComponent.userDetails === undefined) {
      GenerateReportComponent.userDetails = userId;
    } else {
      userId = GenerateReportComponent.userDetails;
      this.startDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();
    }
    this.submissonService.approvedSubmissionDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.submissionDetails(data);
          }
        });
  }

  generateReport() {

    this.selectedReport = [];
    for (const report of this.sortedData) {
      const submissionDate = moment(report.submissionDate).format('MM/DD/YYYY');
      let L1Date: any = '';
      if (report.dateOfL1 !== undefined && report.dateOfL1 !== '') {
        L1Date = moment(report.dateOfL1).format('MM/DD/YYYY, hh:mm a');
      }
      let L2Date: any = '';
      if (report.dateOfL2 !== undefined && report.dateOfL2 !== '') {
        L2Date = moment(report.dateOfL2).format('MM/DD/YYYY, hh:mm a');
      }
      this.selectedReport.push({
        'Candidate Name': report.candidateName,
        'Position Name': report.positionName,
        'Client Name': report.clientName,
        'Submission Date': submissionDate,
        'Recruiter Name': report.recruiterName,
        'Interview Status': report.interviewStatus,
        'L1 Date': L1Date,
        'L2 Date': L2Date,
        'Client Contact Name': report.clientContactName,
        'No of DaysPending': report.age,
        'Current Status': report.currentStatus
      });
    }
    const data = this.selectedReport;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Client_Submission_Report.xlsx', { bookType: 'xlsx', type: 'buffer' });

  }

  submissionDetails(data) {
    this.approvedsubmissions = data.submissionReport;
    for (const date of this.approvedsubmissions) {
      if (!date.dateOfL1) {
        date.dateOfL1 = '';
      }
      if (!date.dateOfL2) {
        date.dateOfL2 = '';
      }
    }
    const decendingOrder = _.sortBy(this.approvedsubmissions, 'submissionDate').reverse();
    this.selectedSubmissions = decendingOrder;
    this.selectedSubmissions = this.approvedsubmissions;
    this.approvedSubmissionsLength = this.selectedSubmissions.length;
    for (const submission of this.selectedSubmissions) {
      const diff = Math.floor(Date.now() - submission.submissionDate);
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
    this.sortedData = this.selectedSubmissions.slice();
  }

  selectedSubmissionDetails(data) {
    const decendingOrder = _.sortBy(data, 'submissionDate').reverse();
    this.selectedSubmissions = decendingOrder;
    this.selectedSubmissions = data;
    this.approvedSubmissionsLength = this.selectedSubmissions.length;
    for (const submission of this.selectedSubmissions) {
      const diff = Math.floor(Date.now() - submission.submissionDate);
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
    this.sortedData = this.selectedSubmissions.slice();
  }

  sortData(sort: Sort) {
    const data = this.selectedSubmissions.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'candidateName': return this.compare(a.candidateName, b.candidateName, isAsc);
        case 'positionName': return this.compare(a.positionName, b.positionName, isAsc);
        case 'clientName': return this.compare(a.clientName, b.clientName, isAsc);
        case 'submissionDate': return this.compare(a.submissionDate, b.submissionDate, isAsc);
        case 'recruiterName': return this.compare(a.recruiterName, b.recruiterName, isAsc);
        case 'interviewStatus': return this.compare(a.interviewStatus, b.interviewStatus, isAsc);
        case 'l1': return this.compare(a.dateOfL1, b.dateOfL1, isAsc);
        case 'l2': return this.compare(a.dateOfL2, b.dateOfL2, isAsc);
        case 'age': return this.compare(a.submissionDate, b.submissionDate, isAsc);
        case 'currentStatus': return this.compare(a.currentStatus, b.currentStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    if (a === undefined && b === undefined) {
    } else {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

}





