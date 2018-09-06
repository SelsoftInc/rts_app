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
  private selectedReport: any;
  private sortedData: any;

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
    this.filter = '';
    this.selectedReport = [];
  }

  ngOnInit() {
    this.ngProgress.start();
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
    this.getApprovedSubmissions();
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
            this.ngProgress.done();
            this.submissionDetails(data);
          }
        });
  }

  generateReport() {

    this.selectedReport = [];
    for (const report of this.sortedData) {
      const submissionDate = moment(report.submissionDate).format('MM/DD/YYYY');
      this.selectedReport.push({
        'Candidate Name': report.candidateName,
        'Position Name': report.positionName,
        'Client Name': report.clientName,
        'Submission Date': submissionDate,
        'Recruiter Name': report.recruiterName,
        'Interview Status': report.interviewStatus,
        'L1': report.dateOfL1,
        'L2': report.dateOfL2,
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
    const decendingOrder = _.sortBy(this.approvedsubmissions, 'submissionDate').reverse();
    this.selectedSubmissions = decendingOrder;
    this.selectedSubmissions = this.approvedsubmissions;
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
    this.sortedData = this.selectedSubmissions.slice();
  }

  selectedSubmissionDetails(data) {
    const decendingOrder = _.sortBy(data, 'submissionDate').reverse();
    this.selectedSubmissions = decendingOrder;
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
        case 'l1': return this.compare(a.l1, b.l1, isAsc);
        case 'l2': return this.compare(a.l2, b.l2, isAsc);
        case 'age': return this.compare(a.age, b.age, isAsc);
        case 'currentStatus': return this.compare(a.currentStatus, b.currentStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}





