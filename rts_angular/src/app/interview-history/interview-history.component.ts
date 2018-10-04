import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ApiUrl } from '../Services/api-url';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-interview-history',
  templateUrl: './interview-history.component.html',
  styleUrls: ['./interview-history.component.css'],
  providers: [LoggedUserService]
})
export class InterviewHistoryComponent implements OnInit {


  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;
  private currentDate: Date;
  private startDate: Date;
  private userRole: any;
  private sortedData: any;
  private interviewReport: any;
  interviewReportLength: any;
  public static userDetails: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private submissonService: SubmissionService,
    private hideComponent: HideComponentService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.currentDate = new Date(Date.now());
    this.startDate = new Date(Date.now());

  }

  ngOnInit() {
    this.ngProgress.start();
    this.getInterviewDetails();
  }

  getInterviewDetails() {

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (InterviewHistoryComponent.userDetails === undefined) {
      InterviewHistoryComponent.userDetails = userId;
    } else {
      userId = InterviewHistoryComponent.userDetails;
      this.startDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();
    }

    this.submissonService.getAllInterviewDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.interviewReport = data.submissionReport;
            this.interviewReportLength = this.interviewReport.length;
            this.sortedData = this.interviewReport.slice();
          }
        });
  }

  filterByDate() {
    InterviewHistoryComponent.userDetails = undefined;
    this.ngProgress.start();
    this.getInterviewDetails();
  }

  sortData(sort: Sort) {
    const data = this.interviewReport.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'positionName': return this.compare(a.positionName, b.positionName, isAsc);
        case 'candidateName': return this.compare(a.candidateName, b.candidateName, isAsc);
        case 'clientName': return this.compare(a.clientName, b.clientName, isAsc);
        case 'InterviewDateTime': return this.compare(a.interviewDateStr, b.interviewDateStr, isAsc);
        case 'InterviewLevel': return this.compare(a.interviewLevel, b.interviewLevel, isAsc);
        case 'recruiterName': return this.compare(a.recruiterName, b.recruiterName, isAsc);
        case 'skype': return this.compare(a.skypeId, b.skypeId, isAsc);
        case 'phoneNumber': return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
        case 'currentStatus': return this.compare(a.currentStatus, b.currentStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
