import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TeamService } from '../Services/team.service';
import { DialogData } from '../manage-team/manage-team.component';
import { Router } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.css'],
  providers: [LoggedUserService]
})
export class DeleteTeamComponent implements OnInit {
  private teamId: any;
  private teams: any;
  private rtsUserId: any;
  private rtsUser: any;
  private teamName: any;
  private selectedTeam: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private toastr: ToastrService,
    private teamService: TeamService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.getCommonDetails();
  }

  getCommonDetails() {

    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.teams = data.teams;
            this.selectedTeam = _.findWhere(this.teams, { teamId: this.data.teamId });
            this.teamName = this.selectedTeam.name;
          }
        });
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteTeam() {

    this.teamService.deleteTeam(this.data)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Delete successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
          }
        });
  }
}

