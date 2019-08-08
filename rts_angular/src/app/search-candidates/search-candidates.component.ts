import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import * as _ from 'underscore';
import { RequirementsService } from '../Services/requirements.service';
import { SendMailComponent } from '../send-mail/send-mail.component';
import { Router } from '@angular/router';
import { CandidateService } from '../Services/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

export interface DialogData {
  mailTo: any;
}


@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: ['./search-candidates.component.css'],
  providers: [LoggedUserService]
})
export class SearchCandidatesComponent implements OnInit {

  selectedSkills: any[];
  selectedCandidates: any[];
  rtsUserId: any;
  technologies: any;
  rtsUser: any;
  candidateLength: number;
  rtsCompanyId: any;
  static skills: any;
  skills: any;
  boldedText: any;

  constructor(
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private loggedUser: LoggedUserService,
    private router: Router,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.selectedSkills = [];
    this.boldedText = [];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllSkills();
    if (SearchCandidatesComponent.skills !== undefined) {
      this.selectedSkills = SearchCandidatesComponent.skills;
      this.getTech();
    }

  }

  // getCommonDetails() {
  //   const companyId = {
  //     userId: this.rtsUserId
  //   };

  //   this.requirementService.commonDetails(companyId)
  //     .subscribe(
  //       data => {
  //         this.ngProgress.done();
  //         if (data.success) {
  //           this.technologies = data.technologies;
  //         }
  //       });
  // }

  getAllSkills() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.getAllSkills(companyId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.skills = data.skills;
          }
        });
  }

  getTech() {
    this.ngProgress.start();
    SearchCandidatesComponent.skills = this.selectedSkills;

    if (this.selectedSkills.length > 0) {

      const submit = {
        skills: this.selectedSkills,
        companyId: this.rtsCompanyId
      }

      this.candidateService.getCandidateByTechnology(submit)
        .subscribe(
          data => {
            this.ngProgress.done();
            if (data.success) {
              this.selectedCandidates = data.candidates;
              this.candidateLength = this.selectedCandidates.length;
            } else {
              this.toastr.error(data.message, '', {
                positionClass: 'toast-top-center',
                timeOut: 3000,
              });
            }
          });
    } else {
      this.ngProgress.done();
      this.selectedCandidates = [];
      this.candidateLength = this.selectedCandidates.length;
    }
  }

  // sendMail() {
  //   SendMailComponent.mailToAddress = this.selectedCandidates;
  //   this.router.navigate(['/send-mail']);
  // }

  sendMail() {
    const dialogRef = this.dialog.open(SendMailComponent, {
      height: '800px',
      width: '1200px',
      data: { mailTo: this.selectedCandidates }
    });

  }





}
