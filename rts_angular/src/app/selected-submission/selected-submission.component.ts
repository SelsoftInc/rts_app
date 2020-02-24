import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';

@Component({
  selector: 'app-selected-submission',
  templateUrl: './selected-submission.component.html',
  styleUrls: ['./selected-submission.component.css'],
  providers: [LoggedUserService]
})
export class SelectedSubmissionComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  sortedData: any[];
  onBoardCandidates: any;
  interviewsLength: any;
  selectedSubmissions: any;
  startDate: Date;
  userRole: any;
  chartData: any[];

  colorScheme = {
    domain: ['#7aa3e5', '#da6969']
  };

  constructor(
    private loggedUser: LoggedUserService,
    private submissonService: SubmissionService,
    private hideComponent: HideComponentService,
    private ngProgress: NgProgress
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.startDate = new Date(Date.now());
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllSelectedSubmissions();
  }

  getAllSelectedSubmissions() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const userId = {
      userId: this.rtsUserId,
      fromDate: fromDate
    };

    this.submissonService.GetAllSelectedSubmission(userId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.selectedSubmissions = data.submissionReport;
            this.interviewsLength = this.selectedSubmissions.length;
            this.sortedData = this.selectedSubmissions.slice();
            let DELIVERED = 0, BACKOUT = 0;
            this.chartData=[];
            for (const sub of this.selectedSubmissions) {
              if (sub.interviewDetailStatus === 'DELIVERED') {
                DELIVERED++;
              } else if (sub.interviewDetailStatus === 'BACKOUT') {
                BACKOUT++;
              }
            }
             let DeliveredObj = {
                name: 'DELIVERED',
                value: DELIVERED
            };

            let BackoutObj = {
                name: 'BACKOUT',
                value: BACKOUT
            };
            this.chartData.push(DeliveredObj);
            this.chartData.push(BackoutObj);
          }
        });
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
        case 'positionName': return this.compare(a.positionName, b.positionName, isAsc);
        case 'candidateName': return this.compare(a.name, b.name, isAsc);
        case 'clientName': return this.compare(a.name, b.name, isAsc);
        case 'joiningDate': return this.compare(a.joiningDateStr, b.joiningDateStr, isAsc);
        case 'recruiterName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'status': return this.compare(a.interviewDetailStatus, b.interviewDetailStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
