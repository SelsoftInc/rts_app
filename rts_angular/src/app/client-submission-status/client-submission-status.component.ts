import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { SubmissionService } from '../Services/submission.service';
import { NgProgress } from 'ngx-progressbar';
import { GraphService } from '../Services/graph.service';


@Component({
  selector: 'app-client-submission-status',
  templateUrl: './client-submission-status.component.html',
  styleUrls: ['./client-submission-status.component.css'],
  providers: [LoggedUserService]
})
export class ClientSubmissionStatusComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private fromDate: any;
  private toDate: any;
  private submissionDetails: any;
  private totalSubmissionByTeam: any;
  private status: any;
  private selectedStatus: any;
  private filteredRequirements: any;
  private clientWiseSubmissionStatus: any;
  private selectedClient: any;
  private clientName: any;
  private clientId: any;

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
        this.clientId = params['id'];
        this.status = params['status'];
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      });
    this.getClientSubmissionStatus();
  }

  getClientSubmissionStatus() {
    const graph = {
      userId: this.rtsUserId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.graphService.clientSubmissionStatus(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.clientWiseSubmissionStatus = data.clientSubmissions;
            this.selectedClient = _.findWhere(this.clientWiseSubmissionStatus, { clientId: this.clientId });
            this.clientName = this.selectedClient.name;
            for (const series of this.selectedClient.series) {
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
