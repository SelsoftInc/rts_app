import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { SubmissionService } from '../Services/submission.service';
import { NgProgress } from 'ngx-progressbar';
import { GraphService } from '../Services/graph.service';

@Component({
  selector: 'app-team-comparison',
  templateUrl: './team-comparison.component.html',
  styleUrls: ['./team-comparison.component.css'],
  providers: [LoggedUserService]
})
export class TeamComparisonComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private fromDate: any;
  private toDate: any;
  private teamId: any;
  private submissionDetails: any;
  private status: any;
  private selectedStatus: any;
  private filteredRequirements: any;
  private teamName: any;
  private selectedTeam: any;
  private teamComparison: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private ngProgress: NgProgress,
    private graphService: GraphService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.teamId = params['id'];
        this.status = params['status'];
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      });
    this.getTeamComparison();
  }

  getTeamComparison() {

    const graph = {
      userId: this.rtsUserId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.graphService.teamComparsion(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.teamComparison = data.teamSubmission;
            this.selectedTeam = _.findWhere(this.teamComparison, { teamId: this.teamId });
            this.teamName = this.selectedTeam.name;
            for (const series of this.selectedTeam.series) {
              if (series.name === this.status) {
                this.selectedStatus = series;
              }
            }
            this.submissionDetails = this.selectedStatus.requirements;
            this.filteredRequirements = this.selectedStatus.requirements;
          }
        });
  }

  filterItem(value) {
    this.submissionDetails = [];
    const filteredItems = Object.assign([], this.filteredRequirements).filter(
      item => item.position.positionName.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.submissionDetails = filteredItems;
  }

}
