import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { DiceService } from '../Services/dice.service';
import * as moment from 'moment';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-view-dice-candidates',
  templateUrl: './view-dice-candidates.component.html',
  styleUrls: ['./view-dice-candidates.component.css'],
  providers: [LoggedUserService]
})
export class ViewDiceCandidatesComponent implements OnInit {
  rtsUser: any;
  rtsUserId: any;
  endDate: Date;
  startDate: Date;
  userRole: any;
  candidates: any;
  candidatesLength: any;
  currentDate: Date;
  // pageNumber: number = 1;
  // pageSize: number;
  lowValue: number = 0;
  highValue: number = 10;

  constructor(
    private loggedUser: LoggedUserService,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private diceService: DiceService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.startDate = new Date(Date.now())
    this.endDate = new Date(Date.now())
    this.currentDate = new Date(Date.now())
  }

  ngOnInit() {
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  dateFilter() {
    this.ngProgress.start();
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.endDate).format('YYYY-MM-DD');
    const submit = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.diceService.getDiceCandidates(submit)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.candidates = data.diceCandidates;
            this.candidatesLength = this.candidates.length;
          }
        });
  }

}
