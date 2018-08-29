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

  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed']
  };

  colorSchemeMulti = {
    domain: ['#0386a4', '#A10A28', '#5AA454']
  };
  totalSubmission: any;

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
    this.getUserGraphDetails();
    this.getTeamGraphDetails();
  }

  getUserGraphDetails() {
    this.recruitersSubmissions = [];

    const date = moment(this.currentDate).format('YYYY-MM-DD');
    const graph = {
      userId: this.rtsUserId,
      date: date
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

  getTeamGraphDetails() {
    this.totalSubmissionByTeam = [];

    const date = moment(this.currentDate).format('YYYY-MM-DD');
    const graph = {
      userId: this.rtsUserId,
      date: date
    };
    this.totalSubmission = 0;

    this.graphService.teamGraphDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.totalSubmissionByTeam = data.teamSubmission;
            for (const count of this.totalSubmissionByTeam) {
              this.totalSubmission = this.totalSubmission + count.value;
            }
          }
        });
  }

  onDateChange(event: Date) {
    if (event !== undefined) {
      this.getUserGraphDetails();
      this.getTeamGraphDetails();
    }
  }

  onSelect(event) {
    const date = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['user-submisson', event.extra.userId, date]);

  }
}
