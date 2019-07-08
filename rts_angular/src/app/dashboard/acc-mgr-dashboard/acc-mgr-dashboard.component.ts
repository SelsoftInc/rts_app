import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as moment from 'moment';
import { LoggedUserService } from '../../Services/logged-user.service';
import { GraphService } from '../../Services/graph.service';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Sort } from '@angular/material';
import { GraphExpansationComponent } from '../../graph-expansation/graph-expansation.component';

@Component({
  selector: 'app-acc-mgr-dashboard',
  templateUrl: './acc-mgr-dashboard.component.html',
  styleUrls: ['./acc-mgr-dashboard.component.css'],
  providers: [LoggedUserService]
})
export class AccMgrDashboardComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private startDate: Date;
  private currentDate: Date;
  private date: any;
  private recruitersSubmissions: any[];

  public static graphData: any;

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
    domain: ['#5BB2A7', '#0FBED8', '#f3a043', '#990A17', '#22E4AC']
  };

  fromDate: any;
  totalSubmissionByTeam: any[];
  totalSubmission: number;
  interviewReport: any;
  interviewReportLength: any;
  sortedData: any;

  constructor(
    private loggedUser: LoggedUserService,
    private graphService: GraphService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.startDate = new Date(Date.now());
    this.currentDate = new Date(Date.now());
  }

  ngOnInit() {
    GraphExpansationComponent.graphExpandDeatils = undefined;
    this.ngProgress.start();
    this.getTeamGraphDetails();
    this.getUserGraphDetails();
    this.getInterviewReport();
  }

  dateFilter() {
    AccMgrDashboardComponent.graphData = undefined;
    this.ngProgress.start();
    this.getTeamGraphDetails();
    this.getUserGraphDetails();
    this.getInterviewReport();
  }

  getTeamGraphDetails() {
    this.totalSubmissionByTeam = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AccMgrDashboardComponent.graphData === undefined) {
      AccMgrDashboardComponent.graphData = graph;
    } else {
      graph = AccMgrDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

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

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AccMgrDashboardComponent.graphData === undefined) {
      AccMgrDashboardComponent.graphData = graph;
    } else {
      graph = AccMgrDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

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

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AccMgrDashboardComponent.graphData === undefined) {
      AccMgrDashboardComponent.graphData = graph;
    } else {
      graph = AccMgrDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.getInterviewDetails(graph)
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


  onTeamSelect(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submisson', event.extra.teamId, fromDate, toDate]);
  }

  onTeamSubmissionStatus(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submissions-status', event.extra.teamId, event.name, fromDate, toDate]);
  }

  onUserSelect(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['user-submisson', event.extra.userId, fromDate, toDate]);
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
        case 'candidateName': return this.compare(a.name, b.name, isAsc);
        case 'clientName': return this.compare(a.name, b.name, isAsc);
        case 'InterviewDateTime': return this.compare(a.interviewDateStr, b.interviewDateStr, isAsc);
        case 'InterviewLevel': return this.compare(a.interviewLevel, b.interviewLevel, isAsc);
        case 'recruiterName': return this.compare(a.firstName, b.firstName, isAsc);
        case 'skype': return this.compare(a.skype, b.skype, isAsc);
        case 'phoneNumber': return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
