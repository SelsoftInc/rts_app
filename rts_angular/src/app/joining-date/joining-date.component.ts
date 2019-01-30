import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';

@Component({
  selector: 'app-joining-date',
  templateUrl: './joining-date.component.html',
  styleUrls: ['./joining-date.component.css'],
  providers: [LoggedUserService]
})
export class JoiningDateComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  sortedData: any[];
  onBoardCandidates: any;
  interviewsLength: any;
  private startDate: Date;
  userRole: any;

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
    this.getOnboardReminder();
  }

  getOnboardReminder() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const userId = {
      userId: this.rtsUserId,
      fromDate: fromDate
    };

    this.submissonService.GetAllOnBoardReminder(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.onBoardCandidates = data.submissionReport;
            this.interviewsLength = this.onBoardCandidates.length;
            this.sortedData = this.onBoardCandidates.slice();
          }
        });
  }

  filterByDate() {
    this.ngProgress.start();
    this.getOnboardReminder();
  }

  sortData(sort: Sort) {
    const data = this.onBoardCandidates.slice();
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
        case 'joiningDate': return this.compare(a.joiningDateStr, b.joiningDateStr, isAsc);
        case 'recruiterName': return this.compare(a.recruiterName, b.recruiterName, isAsc);
        case 'interviewStatus': return this.compare(a.interviewDetailStatus, b.interviewDetailStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
