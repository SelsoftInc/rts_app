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
  selector: 'app-recruiter-submissions-status',
  templateUrl: './recruiter-submissions-status.component.html',
  styleUrls: ['./recruiter-submissions-status.component.css'],
  providers: [LoggedUserService]
})
export class RecruiterSubmissionsStatusComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private fromDate: any;
  private toDate: any;
  private userId: any;
  private submissionDetails: any;
  private status: any;
  private selectedUser: any;
  private selectedStatus: any;
  private filteredRequirements: any;
  private userName: any;
  private userRole: any;
  totalSubmissionStatus: any;
  requirements: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private ngProgress: NgProgress,
    private graphService: GraphService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.userId = params['id'];
        this.status = params['status'];
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      });
    this.GetRecruiterSubmissionStatus();
  }

  GetRecruiterSubmissionStatus() {
    const graph = {
      userId: this.userId,
      status: this.status,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.submissionService.GetRecruiterSubmissionStatus(graph)
      .subscribe(
        data => {
          console.log(data);
          if (data.success) {
            this.ngProgress.done();
            this.requirements = data.requirements;
            this.submissionDetails = this.requirements;
            this.filteredRequirements = this.requirements;
          }
        });
  }
}
