import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';

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

  constructor(
    private loggedUser: LoggedUserService,
    private router: Router,
    private requirementService: RequirementsService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.getCommonDetails();
  }

  getCommonDetails() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.teams = data.teams;
            this.teamLength = this.teams.length;
            console.log(this.teams);
          }
        });
  }

}
