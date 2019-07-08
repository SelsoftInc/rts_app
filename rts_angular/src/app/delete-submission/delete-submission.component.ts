import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { LoggedUserService } from '../Services/logged-user.service';
import { DialogData } from '../submissions/submissions.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequirementsService } from '../Services/requirements.service';
import { SubmissionService } from '../Services/submission.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-delete-submission',
  templateUrl: './delete-submission.component.html',
  styleUrls: ['./delete-submission.component.css'],
  providers: [LoggedUserService]
})
export class DeleteSubmissionComponent implements OnInit {

  private rtsUserId: any;
  private rtsUser: any;
  selectedRequirement: any;
  name: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteSubmissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private submissionService: SubmissionService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    // this.getSubmission();
  }
  
  // getSubmission() {

  //   this.submissionService.getRequirementBySubmission(this.data)
  //     .subscribe(
  //       data => {
  //         if (data.success) {
  //           this.selectedRequirement = data.requirement;
  //           const submission = _.findWhere(this.selectedRequirement.submissions, this.data);
  //           console.log(submission);
  //         }
  //       })
  // }

  cancel() {
    this.dialogRef.close();
  }

  deleteSubmission() {
    this.dialogRef.close();

    // this.teamService.deleteTeam(this.data)
    //   .subscribe(
    //     data => {
    //       if (data.success) {
    //         this.toastr.success('Delete successfully', '', {
    //           positionClass: 'toast-top-center',
    //           timeOut: 3000,
    //         });
    //         this.dialogRef.close();
    //       } else {
    //         this.toastr.error(data.message, '', {
    //           positionClass: 'toast-top-center',
    //           timeOut: 3000,
    //         });
    //         this.dialogRef.close();
    //       }
    //     });
  }

}
