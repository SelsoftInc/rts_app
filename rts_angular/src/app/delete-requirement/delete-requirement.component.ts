import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from '../submissions/submissions.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequirementsService } from '../Services/requirements.service';

@Component({
  selector: 'app-delete-requirement',
  templateUrl: './delete-requirement.component.html',
  styleUrls: ['./delete-requirement.component.css'],
  providers: [LoggedUserService]
})
export class DeleteRequirementComponent implements OnInit {

  private rtsUserId: any;
  private rtsUser: any;
  selectedRequirement: any;
  name: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteRequirementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.getAllRequirements();
  }

  getAllRequirements() {

    this.requirementService.getRequirementsById(this.data)
      .subscribe(
        data => {
          if (data.success) {
            this.selectedRequirement = data.requirement;
            this.name = this.selectedRequirement.position.positionName;
          }
        })
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteRequirement() {
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
