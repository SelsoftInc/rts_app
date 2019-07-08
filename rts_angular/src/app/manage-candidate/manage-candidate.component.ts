import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { CandidateService } from '../Services/candidate.service';
import { NgProgress } from 'ngx-progressbar';
import { GraphExpansationComponent } from '../graph-expansation/graph-expansation.component';

@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrls: ['./manage-candidate.component.css'],
  providers: [LoggedUserService]
})
export class ManageCandidateComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;
  private candidates: any;
  private candidateLength: any;

  constructor(
    private loggedUser: LoggedUserService,
    private candidateService: CandidateService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    GraphExpansationComponent.graphExpandDeatils = undefined;
    this.ngProgress.start();
    this.getAllCandidates();
  }

  getAllCandidates() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.candidateService.allCandidate(companyId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.candidates = data.candidates;
            this.candidateLength = this.candidates.length;
          }
        });

  }

}

