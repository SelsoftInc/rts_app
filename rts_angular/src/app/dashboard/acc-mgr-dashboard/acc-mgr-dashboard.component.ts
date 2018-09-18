import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as moment from 'moment';
import { LoggedUserService } from '../../Services/logged-user.service';
import { GraphService } from '../../Services/graph.service';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-acc-mgr-dashboard',
  templateUrl: './acc-mgr-dashboard.component.html',
  styleUrls: ['./acc-mgr-dashboard.component.css'],
  providers: [LoggedUserService]
})
export class AccMgrDashboardComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private currentDate: Date;
  private date: any;
  private recruitersSubmissions: any[];

  view: any[] = undefined;
  showDataLabel = true;
  show = true;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Recruiters';
  showYAxisLabel = true;
  yAxisLabel = 'Submissions';

  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed']
  };

  colorSchemePie = {
    domain: ['#b24348', '#f3a043', '#f8c644', '#d0d864', '#d05577', '#d14e46']
  };

  colorSchemeMultiBar1 = {
    domain: ['#08B3E5', '#0FBED8', '#14C9CB', '#990A17', '#22E4AC']
  };

  fromDate: any;
  totalSubmissionByTeam: any[];
  totalSubmission: number;
  interviewReport: any;
  interviewReportLength: any;

  constructor(
    private loggedUser: LoggedUserService,
    private graphService: GraphService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.currentDate = new Date(Date.now());
  }

  ngOnInit() {
    this.ngProgress.start();
    this.fromDate = this.currentDate;
    this.getTeamGraphDetails();
    this.getUserGraphDetails();
    this.getInterviewReport();
  }

  dateFilter() {
    this.ngProgress.start();
    this.getTeamGraphDetails();
    this.getUserGraphDetails();
    this.getInterviewReport();
  }

  getTeamGraphDetails() {
    this.totalSubmissionByTeam = [];

    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    const graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };
    this.totalSubmission = 0;

    this.graphService.teamGraphDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.totalSubmissionByTeam = data.teamSubmission;
            for (const count of this.totalSubmissionByTeam) {
              this.totalSubmission = this.totalSubmission + count.value;
              count.extra = {
                teamId: count.teamId
              };
            }
            for (const team of this.totalSubmissionByTeam) {
              for (const series of team.series) {
                series.extra = {
                  teamId: team.teamId
                };
              }
            }
          }
        });
  }

  getUserGraphDetails() {
    this.recruitersSubmissions = [];

    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    const graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.graphService.userGraphDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.recruitersSubmissions = data.userSubmissions;
            for (const count of this.recruitersSubmissions) {
              count.extra = {
                userId: count.userId
              };
            }
          }
        });
  }

  getInterviewReport() {

    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    const graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.graphService.getInterviewDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.interviewReport = data.submissionReport;
            this.interviewReportLength = this.interviewReport.length;
          }
        });
  }


  onTeamSelect(event) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submisson', event.extra.teamId, fromDate, toDate]);
  }

  onTeamSubmissionStatus(event) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submissions-status', event.extra.teamId, event.name, fromDate, toDate]);
  }

  onUserSelect(event) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['user-submisson', event.extra.userId, fromDate, toDate]);
  }
}
