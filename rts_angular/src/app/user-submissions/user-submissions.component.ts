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
  selector: 'app-user-submissions',
  templateUrl: './user-submissions.component.html',
  styleUrls: ['./user-submissions.component.css'],
  providers: [LoggedUserService]
})
export class UserSubmissionsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private recruiterId: any;
  private submissionsLength: any;
  private submissionDetails: any;
  private recruiterDetails: any;
  private recruiterName: string;
  private filteredRequirements: any;
  private fromDate: any;
  private toDate: any;
  private userRole: any;
  totalSubmissionByTeam: any;
  selectedRecruiter: any;
  recruitersSubmissions: any;

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
        this.recruiterId = params['id'];
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      });
    if (this.userRole === 'ADMIN') {
      this.getUserSubmission();
    } else if (this.userRole === 'ACC_MGR' || this.userRole === 'TL') {
      this.getUserGraphDetails();
    }
  }

  getUserSubmission() {
    const userId = {
      userId: parseInt(this.recruiterId),
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.submissionService.getUserSubmissions(userId)
      .subscribe(
        data => {
            this.ngProgress.done();
            if (data.success) {
            this.submissionDetails = data.requirements;
            this.filteredRequirements = this.submissionDetails;
            this.recruiterDetails = data.user;
            this.recruiterName = this.recruiterDetails.firstName + ' ' + this.recruiterDetails.lastName;
            this.submissionsLength = this.submissionDetails.length;

          }
        });
  }

  getUserGraphDetails() {
    const graph = {
      userId: this.rtsUserId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.graphService.userGraphDetails(graph)
      .subscribe(
        data => {
            this.ngProgress.done();
            if (data.success) {
            this.recruitersSubmissions = data.userSubmissions;
            this.selectedRecruiter = _.findWhere(this.recruitersSubmissions, { userId: parseInt(this.recruiterId) });
            this.submissionDetails = this.selectedRecruiter.requirements;
            this.filteredRequirements = this.selectedRecruiter.requirements;
            this.recruiterName = this.selectedRecruiter.name;
            this.submissionsLength = this.submissionDetails.length;
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
