import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { SubmissionService } from '../Services/submission.service';

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
  private date: any;
  private submissionsLength: any;
  private submissionDetails: any;
  private recruiterDetails: any;
  private recruiterName: string;
  filteredRequirements: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.recruiterId = params['id'];
        this.date = params['date'];
      });
    this.getUserSubmission();
  }

  getUserSubmission() {
    const userId = {
      userId: this.recruiterId,
      fromDate: this.date,
      toDate: this.date
    };

    this.submissionService.getUserSubmissions(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.submissionDetails = data.requirements;
            this.filteredRequirements = this.submissionDetails;
            this.recruiterDetails = data.user;
            this.recruiterName = this.recruiterDetails.firstName + ' ' + this.recruiterDetails.lastName;
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
