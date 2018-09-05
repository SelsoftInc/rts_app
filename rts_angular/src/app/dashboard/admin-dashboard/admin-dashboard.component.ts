import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as moment from 'moment';
import { LoggedUserService } from '../../Services/logged-user.service';
import { GraphService } from '../../Services/graph.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers: [LoggedUserService]
})
export class AdminDashboardComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private recruitersSubmissions: any[];
  private multi: any[];
  private totalSubmissionByTeam: any[];
  private currentDate: Date;
  private date: any;

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
  yAxisClientLabel = 'Requirements';

  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed']
  };

  colorSchemePie = {
    domain: ['#b24348', '#f3a043', '#f8c644', '#d0d864', '#d05577', '#d14e46']
  };

  colorSchemeMultiBar1 = {
    domain: ['#f5dd98', '#d2da66', '#b83330', '#a8385d']
  };

  colorSchemeMulti = {
    domain: ['#0386a4', '#A10A28', '#5AA454']
  };
  private totalSubmission: any;
  private teamDetails: any;
  private clientOpenRequitements: any;
  fromDate: any;

  constructor(
    private loggedUser: LoggedUserService,
    private graphService: GraphService,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.currentDate = new Date(Date.now());
  }

  ngOnInit() {
    const currentDateMoment: moment.Moment = moment(this.currentDate);
    this.fromDate = currentDateMoment.subtract(3, 'days').format('YYYY-MM-DD');
    this.getUserGraphDetails();
    this.getTeamGraphDetails();
    this.getClientRequirementsDetails();
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

  getClientRequirementsDetails() {
    this.clientOpenRequitements = [];

    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    const graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.graphService.getClientOpenRequirements(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.clientOpenRequitements = data.clientRequirements;
            for (const count of this.clientOpenRequitements) {
              count.extra = {
                clientId: count.clientId
              };
            }
          }
        });
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
          }
        });
  }

  dateFilter() {
    this.getUserGraphDetails();
    this.getTeamGraphDetails();
    this.getClientRequirementsDetails();
  }

  onUserSelect(event) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['user-submisson', event.extra.userId, fromDate, toDate]);
  }

  onTeamSelect(event) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submisson', event.extra.teamId, fromDate, toDate]);
  }

  onClientSelect(event) {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['client-requirements', event.extra.clientId, fromDate, toDate]);
  }
}
