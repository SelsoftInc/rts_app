import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import * as moment from 'moment';
import { HideComponentService } from '../Services/hide-component.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
  providers: [LoggedUserService]
})
export class RequirementsComponent implements OnInit {
  private rtsUser: any;
  private rtsUserId: any;
  private requirements: any;
  private createdOn: any;
  private requirementsLength: any;
  private userRole: any;
  private requirementsForUser: any;
  private requirementsLengthForUser: any;
  private rtsCompanyId: any;
  private currentDate: Date;
  private requirementsForTeam: any;
  private requirementsLengthForTeam: any;
  submittedRequirements: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.currentDate = new Date();
    this.submittedRequirements = [];
  }

  ngOnInit() {
    this.hideComponent.displayComponent = true;
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
            this.requirementsLength = this.requirements.length;
            for (const require of this.requirements) {
              const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
              const day = 1000 * 60 * 60 * 24;
              const days = Math.floor(diff / day);
              const weeks = Math.floor(days / 7);
              const months = Math.floor(days / 31);
              const years = Math.floor(months / 12);
              if (days < 7) {
                require.age = days + ' days ago';
              } else if (weeks < 4) {
                require.age = weeks + ' weeks ago';
              } else if (months < 12) {
                require.age = months + ' months ago';
              } else {
                require.age = years + ' years ago';
              }
            }
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
            this.requirementsForUser = data.requirements;
            this.requirementsLengthForUser = this.requirementsForUser.length;
            for (const require of this.requirementsForUser) {
              const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
              const day = 1000 * 60 * 60 * 24;
              const days = Math.floor(diff / day);
              const weeks = Math.floor(days / 7);
              const months = Math.floor(days / 31);
              const years = Math.floor(months / 12);
              if (days < 7) {
                require.age = days + ' days ago';
              } else if (weeks < 4) {
                require.age = weeks + ' weeks ago';
              } else if (months < 12) {
                require.age = months + ' months ago';
              } else {
                require.age = years + ' years ago';
              }
            }
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
          console.log(data);
          if (data.success) {
            this.requirementsForTeam = data.requirements;
            this.requirementsLengthForTeam = this.requirementsForTeam.length;
            for (const require of this.requirementsForTeam) {
              const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
              const day = 1000 * 60 * 60 * 24;
              const days = Math.floor(diff / day);
              const weeks = Math.floor(days / 7);
              const months = Math.floor(days / 31);
              const years = Math.floor(months / 12);
              if (days < 7) {
                require.age = days + ' days ago';
              } else if (weeks < 4) {
                require.age = weeks + ' weeks ago';
              } else if (months < 12) {
                require.age = months + ' months ago';
              } else {
                require.age = years + ' years ago';
              }
            }
          }
        });
  }

}
