import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';

@Component({
  selector: 'app-recruiter-submissions',
  templateUrl: './recruiter-submissions.component.html',
  styleUrls: ['./recruiter-submissions.component.css'],
  providers: [LoggedUserService]
})
export class RecruiterSubmissionsComponent implements OnInit {

  rtsUser: any;
  rtsUserId: any;
  requirementsForUser: any;
  requirementsLengthForUser: any;
  submissionDetails: any;
  submissionsLength: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.submissionDetails = [];
  }

  ngOnInit() {
    this.getAllRequirementsForUser();
  }


  getAllRequirementsForUser() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsForUser = data.requirements;
            for (const require of this.requirementsForUser) {
              if (require.submissions.length > 0) {
                this.submissionDetails.push(require);
              }
            }
            this.submissionsLength = this.submissionDetails.length;
          }
        });
  }

}
