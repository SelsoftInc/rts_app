import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';
import { DiceService } from '../Services/dice.service';
import { MatDialog } from '@angular/material';
import { DiceRequirementsViewComponent } from '../dice-requirements-view/dice-requirements-view.component';

export interface DialogData {
  diceCandidateId: any;
}

@Component({
  selector: 'app-dice-detail-view',
  templateUrl: './dice-detail-view.component.html',
  styleUrls: ['./dice-detail-view.component.css'],
  providers: [LoggedUserService]
})
export class DiceDetailViewComponent implements OnInit {


  rtsUser: any;
  rtsUserId: any;
  userRole: any;
  rtsCompanyId: any;
  hide = true;
  selectedCandidate: any;
  candidateResume: string;
  candidateId: any;
  selectedResume: any;
  selectedUsage: any;
  inLocalData: boolean;

  constructor(
    // public sanitizer: DomSanitizer,
    private loggedUser: LoggedUserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private diceService: DiceService,
    private dialog: MatDialog,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.candidateId = params['id'];
      });
    this.getDiceCandidate();
    // this.selectedUsage = {
    //   "viewsConsumed": 48,
    //   "quota": 200,
    //   "customerId": 1923599,
    //   "viewsRemaining": 152
    // }
  }

  getDiceCandidate() {
    const submit = {
      userId: this.rtsUserId,
      diceId: this.candidateId
    };

    this.diceService.getDiceProfile(submit)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.selectedCandidate = data.diceProfile;
            this.selectedResume = data.resume;
            this.candidateResume = 'data:' + this.selectedResume.contentType + ';base64,' + this.selectedResume.resumeData;
            this.selectedUsage = data.usage;
            this.inLocalData = data.inLocal;
          }
          else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

  openRequirements(){
    const dialogRef = this.dialog.open(DiceRequirementsViewComponent, {
      width: '1000px',
      data: { diceCandidateId: this.candidateId }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
