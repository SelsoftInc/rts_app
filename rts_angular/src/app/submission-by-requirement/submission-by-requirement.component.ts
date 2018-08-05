import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../Services/requirements.service';
import { LoggedUserService } from '../Services/logged-user.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-submission-by-requirement',
  templateUrl: './submission-by-requirement.component.html',
  styleUrls: ['./submission-by-requirement.component.css'],
  providers: [LoggedUserService]
})
export class SubmissionByRequirementComponent implements OnInit {

  private rtsUser: any;
  private rtsCompanyId: any;
  private requirementId: any;
  private requirements: any;
  private selectedRequirement: any;
  private submissionsLength: any;
  private userRole: any;
  private rtsUserId: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });
    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER') {
      this.getAllRequirementsForUser();
    }
  }

  getAllRequirements() {

    const userId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            this.selectedRequirement = _.findWhere(this.requirements, { requirementId: this.requirementId });
            this.submissionsLength = this.selectedRequirement.submissions.length;
          }
        });
  }

  getAllRequirementsForTeam() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsByTeam(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            this.selectedRequirement = _.findWhere(this.requirements, { requirementId: this.requirementId });
            this.submissionsLength = this.selectedRequirement.submissions.length;
          }
        });
  }

  getAllRequirementsForUser() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            this.selectedRequirement = _.findWhere(this.requirements, { requirementId: this.requirementId });
            this.submissionsLength = this.selectedRequirement.submissions.length;
          }
        });
  }

}

