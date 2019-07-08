import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-in-progress-interviews',
  templateUrl: './in-progress-interviews.component.html',
  styleUrls: ['./in-progress-interviews.component.css'],
  providers: [LoggedUserService]
})
export class InProgressInterviewsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  selectedInterviews: any[];
  interviewReport: any[];
  sortedData: any[];
  interviewsLength: any;
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
    this.interviewReport = [];
    this.selectedInterviews = [];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllInprogressInterviews();
  }

  getAllInprogressInterviews() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.submissonService.GetAllProgressInterviews(companyId)
      .subscribe(
        data => {
            this.ngProgress.done();
            if (data.success) {
            this.selectedInterviews = data.submissionReport;
            this.interviewsLength = this.selectedInterviews.length;
            this.sortedData = this.selectedInterviews.slice();
          }
        });
  }

  sortData(sort: Sort) {
    const data = this.selectedInterviews.slice();
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
        case 'InterviewDateTime': return this.compare(a.interviewDateStr, b.interviewDateStr, isAsc);
        case 'recruiterName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'skype': return this.compare(a.skype, b.skype, isAsc);
        case 'phoneNumber': return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
        case 'currentStatus': return this.compare(a.currentStatus, b.currentStatus, isAsc);
        case 'interviewStatus': return this.compare(a.interviewStatus, b.interviewStatus, isAsc);
        case 'submissionStatus': return this.compare(a.statusName, b.statusName, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
