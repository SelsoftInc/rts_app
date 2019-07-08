import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../Services/requirements.service';
import { LoggedUserService } from '../Services/logged-user.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { NgProgress } from 'ngx-progressbar';
import { DeleteSubmissionComponent } from '../delete-submission/delete-submission.component';
import { MatDialog } from '@angular/material';

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

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private ngProgress: NgProgress,
    private dialog: MatDialog,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });
    this.getAllRequirements();
  }

  getAllRequirements() {

    const userId = {
      requirementId: parseInt(this.requirementId)
    };

    this.requirementService.getRequirementsById(userId)
      .subscribe(
        data => {
            this.ngProgress.done();
            if (data.success) {
            // this.requirements = data.requirements;
            this.selectedRequirement = data.requirement;
            this.submissionsLength = this.selectedRequirement.submissions.length;
          }
        });
  }

  deleteSubmission(id) {
    const dialogRef = this.dialog.open(DeleteSubmissionComponent, {
      width: '500px',
      data: { submissionId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result',result);
      // this.router.navigate(['requirements']);
    });

  }


}

