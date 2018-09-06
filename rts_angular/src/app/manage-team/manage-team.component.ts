import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MatDialog } from '@angular/material';
import { DeleteTeamComponent } from '../delete-team/delete-team.component';
import { NgProgress } from 'ngx-progressbar';

export interface DialogData {
  teamId: any;
}

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.css'],
  providers: [LoggedUserService]
})
export class ManageTeamComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;
  private teams: any;
  private teamLength: any;
  private userRole: any;
  private teamId: any;

  constructor(
    private loggedUser: LoggedUserService,
    private router: Router,
    private requirementService: RequirementsService,
    private dialog: MatDialog,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.ngProgress.start();
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
            this.ngProgress.done();
            this.teams = data.teams;
            this.teamLength = this.teams.length;
          }
        });
  }

  deleteTeam(teamId) {
    this.teamId = teamId;
    const dialogRef = this.dialog.open(DeleteTeamComponent, {
      width: '500px',
      data: { teamId: this.teamId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCommonDetails();
    });

  }
}
