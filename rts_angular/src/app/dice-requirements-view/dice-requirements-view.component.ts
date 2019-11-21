import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { RequirementsService } from '../Services/requirements.service';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DialogData } from '../dice-detail-view/dice-detail-view.component';
import { ApiUrl } from '../Services/api-url';

@Component({
  selector: 'app-dice-requirements-view',
  templateUrl: './dice-requirements-view.component.html',
  styleUrls: ['./dice-requirements-view.component.css'],
  providers: [LoggedUserService]
})
export class DiceRequirementsViewComponent implements OnInit {
  rtsUser: any;
  rtsCompanyId: any;
  rtsUserId: any;
  userRole: any;
  fromDate: Date;
  currentDate: Date;
  submittedRequirements: any[];
  requirementsLength: any;
  requirements: any;
  baseUrl: string;

  constructor(
    public dialogRef: MatDialogRef<DiceRequirementsViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private router: Router,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.fromDate = new Date(Date.now());
    this.currentDate = new Date(Date.now());
    this.submittedRequirements = [];

  }

  ngOnInit() { 
     this.baseUrl = ApiUrl.BaseUrl;
    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER' || this.userRole === 'TRAINEE') {
      this.getAllRequirementsForUser();
    }
  }

  filterByDate() {
    if (this.userRole === 'ADMIN') {
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForTeam();
    } else if (this.userRole === 'RECRUITER' || this.userRole === 'TRAINEE') {
      this.getAllRequirementsForUser();
    }
  }

  addSubmission(requirementId) {  
    this.router.navigate(['add-new-submission', requirementId, this.data.diceCandidateId]);
    this.dialogRef.close();
  }


  getAllRequirements() {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      companyId: this.rtsCompanyId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.fromDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
    this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();


    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getAllRequirementsForUser() {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.fromDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
    this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  getAllRequirementsForTeam() {
    const fromDate = moment(this.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.fromDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
    this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();


    this.requirementService.requirementsDetailsByTeam(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails(data);
          }
        });
  }

  requirementsDetails(data) {
    this.requirements = data.requirements;
    this.requirements.reverse();
    this.requirementsLength = this.requirements.length;
    console.log(this.requirements)
    for (const require of this.requirements) {
      const diff = Math.floor(Date.now() - require.createdOn);
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

}
