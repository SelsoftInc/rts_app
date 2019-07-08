import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import * as _ from 'underscore';
import { RequirementsService } from '../Services/requirements.service';
import { SendMailComponent } from '../send-mail/send-mail.component';
import { Router } from '@angular/router';
import { CandidateService } from '../Services/candidate.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: ['./search-candidates.component.css'],
  providers: [LoggedUserService]
})
export class SearchCandidatesComponent implements OnInit {

  selected: any[];
  selectedCandidates: any[];
  rtsUserId: any;
  technologies: any;
  rtsUser: any;
  candidateLength: number;
  rtsCompanyId: any;
  static technology: any;

  constructor(
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private loggedUser: LoggedUserService,
    private router: Router,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.selected = [];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getCommonDetails();
    if (SearchCandidatesComponent.technology !== undefined) {
      this.selected = SearchCandidatesComponent.technology;
      this.getTech();
    }

  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
            this.ngProgress.done();
            if (data.success) {
            this.technologies = data.technologies;
          }
        });
  }

  getTech() {
    this.ngProgress.start();
    const technology = []
    SearchCandidatesComponent.technology = this.selected;
    for (const techId of this.selected) {
      technology.push({ technologyId: techId })
    }
    const submit = {
      technology: technology,
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
  }

  sendMail() {
    SendMailComponent.candidatesList = this.selectedCandidates;
    this.router.navigate(['/send-mail']);
  }



}
