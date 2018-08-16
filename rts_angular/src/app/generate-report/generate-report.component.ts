import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import * as moment from 'moment';

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
  private approvedsubmissionsLength: any;
  private userRole: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private submissonService: SubmissionService,
    private hideComponent: HideComponentService
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.getApprovedSubmissions();
  }

  getApprovedSubmissions() {

    const userId = {
      userId: this.rtsUserId,
    };

    this.submissonService.approvedSubmissionDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.approvedsubmissions = data.submissionReport;
            this.approvedsubmissionsLength = this.approvedsubmissions.length;
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
        });
  }

  generateReport() {

    const userId = {
      userId: this.rtsUserId,
    };

    this.submissonService.getReport(userId)
      .subscribe(
        data => {
          if (data.success) {
            window.location.href = 'http://rameshrasaiyan.com:8080/' + data.downloadUrl;
          }
        });

  }
}

