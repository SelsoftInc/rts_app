import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { SubmissionService } from '../Services/submission.service';

@Component({
  selector: 'app-team-submissions',
  templateUrl: './team-submissions.component.html',
  styleUrls: ['./team-submissions.component.css'],
  providers: [LoggedUserService]
})
export class TeamSubmissionsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private teamId: any;
  private date: any;
  private submissionsLength: any;
  private submissionDetails: any;
  private teamDetails: any;
  private teamName: string;

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
        this.teamId = params['id'];
        this.date = params['date'];
      });
    this.getTeamSubmission();
  }

  getTeamSubmission() {
    const userId = {
      teamId: this.teamId,
      fromDate: this.date,
      toDate: this.date
    };

    this.submissionService.getTeamSubmissions(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.submissionDetails = data.requirements;
            this.teamDetails = data.team;
            this.teamName = this.teamDetails.name;
            this.submissionsLength = this.submissionDetails.length;

          }
        });
  }

}
