import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-report',
  templateUrl: './candidate-report.component.html',
  styleUrls: ['./candidate-report.component.css'],
  providers: [LoggedUserService]
})
export class CandidateReportComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;
  private userRole: any;
  private clients: any;
  private client: string;
  private fromDate: Date;
  private currentDate: Date;
  private submissionsLength: number;
  private submissionDetails: any[];
  private requirements: any;
  private filteredRequirements: any;
  private selectedRequirements: any;
  private filter: string;
  private isClient: boolean;
  public static userDetails: any;
  public static filterBy: any;
  public static client: any;
  private selectedReport: any[];

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private router: Router,
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
    this.fromDate = new Date(Date.now());
    this.currentDate = new Date(Date.now());
    this.filter = '';
    this.client = '';
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getCommonDetails();
    this.getAllSubmissions();
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
          }
        });
  }

  filterByDate() {
    CandidateReportComponent.userDetails = undefined;
    CandidateReportComponent.client = undefined;
    this.client = '';
    this.ngProgress.start();
    this.filterBy('');
    this.getAllSubmissions();
  }

  filterBy(value) {

    CandidateReportComponent.filterBy = value;

    if (value === 'client') {
      this.isClient = true;
    } else if (value === '') {
      this.filter = '';
      this.isClient = false;
    }

    for (const require of this.requirements) {
      require.filteredSubmissions = require.submissions;
    }
    this.selectedRequirementsDetails(this.requirements);
  }

  getAllSubmissions() {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (CandidateReportComponent.userDetails === undefined) {
      CandidateReportComponent.userDetails = userId;
    } else {
      userId = CandidateReportComponent.userDetails;
      this.fromDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();
    }

    this.requirementService.getAllSubmissionsByDate(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requimentsDetails(data);
          }
        });
  }

  requimentsDetails(data) {
    this.ngProgress.done();
    this.submissionsLength = 0;
    this.submissionDetails = [];
    this.requirements = data.requirements;
    for (const require of this.requirements) {
      require.filteredSubmissions = require.submissions;
    }
    this.filteredRequirements = this.requirements;
    this.selectedRequirements = this.requirements;
    for (const require of this.selectedRequirements) {
      if (require.submissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    for (const count of this.submissionDetails) {
      this.submissionsLength = this.submissionsLength + count.submissions.length;
    }
    if (CandidateReportComponent.filterBy !== undefined) {
      this.filter = CandidateReportComponent.filterBy;
      this.filterBy(CandidateReportComponent.filterBy);
      if (CandidateReportComponent.filterBy === 'client') {
        this.selectClient(CandidateReportComponent.client);
      }
    }
  }

  selectedRequirementsDetails(data) {
    this.submissionsLength = 0;
    this.submissionDetails = [];
    this.selectedRequirements = data;
    this.filteredRequirements = this.selectedRequirements;
    for (const require of this.selectedRequirements) {
      if (require.filteredSubmissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    for (const count of this.submissionDetails) {
      this.submissionsLength = this.submissionsLength + count.filteredSubmissions.length;
    }
  }

  selectClient(event) {
    CandidateReportComponent.client = event;
    this.client = event;
    if (event === 'selectAll') {
      for (const require of this.requirements) {
        require.filteredSubmissions = require.submissions;
      }
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      for (const require of this.requirements) {
        require.filteredSubmissions = require.submissions;
      }
      this.selectedRequirements = _.where(this.requirements, { clientId: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  downloadReport() {

    this.selectedReport = [];
    for (const submission of this.submissionDetails) {
      for (const report of submission.filteredSubmissions) {
        this.selectedReport.push({
          'Candidate Name': report.candidate.name,
          'Work Authorization': report.candidate.visaStatus.visaName,
          'Availability': report.candidate.availability,
          'Rate': report.sellingRate,
          'Current Location': report.candidate.location,
          'Contact': report.candidate.phoneNumber,
          'Email': report.candidate.email,
          'Skype': report.candidate.skype,
          'LinkedIn': report.candidate.linkedIn,
        });
      }
    }
    const data = this.selectedReport;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Candidate_Report.xlsx', { bookType: 'xlsx', type: 'buffer' });

  }

}
