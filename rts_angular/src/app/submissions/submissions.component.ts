import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
  providers: [LoggedUserService]
})
export class SubmissionsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private submissions: any;
  private submissionsLength: any;
  private requirements: any;
  private submissionDetails: any;
  private rtsCompanyId: any;
  private userRole: any;


  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
    this.submissionDetails = [];
  }

  ngOnInit() {
    if (this.userRole === 'ADMIN') {
      this.getAllSubmissions();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllSubmissionsForTeam();
    }
  }

  getAllSubmissions() {

    const userId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            for (const require of this.requirements) {
              if (require.submissions.length > 0) {
                this.submissionDetails.push(require);
              }
            }
            this.submissionsLength = this.submissionDetails.length;
          }
        });
  }

  getAllSubmissionsForTeam() {

    const teamId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsByTeam(teamId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            for (const require of this.requirements) {
              if (require.submissions.length > 0) {
                this.submissionDetails.push(require);
              }
            }
            this.submissionsLength = this.submissionDetails.length;
          }
        });
  }

}
