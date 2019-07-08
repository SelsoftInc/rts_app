import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { CandidateService } from '../Services/candidate.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-search-candidate-email',
  templateUrl: './search-candidate-email.component.html',
  styleUrls: ['./search-candidate-email.component.css'],
  providers: [LoggedUserService]
})
export class SearchCandidateEmailComponent implements OnInit {
  selected: any[];
  selectedCandidates: any[];
  rtsUserId: any;
  technologies: any;
  rtsUser: any;
  candidateLength: number;
  rtsCompanyId: any;
  searchString: any;

  constructor(
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
    this.searchString = '';
    this.selectedCandidates = [];
  }

  ngOnInit() {

  }

  getCandidate() {
    this.ngProgress.start();

    const candidate = {
      email: this.searchString,
      companyId: this.rtsCompanyId
    };

    this.candidateService.getCandidate(candidate)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {;
            this.selectedCandidates.push(data.candidate);
            this.candidateLength = this.selectedCandidates.length;
          }
          else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }


}
