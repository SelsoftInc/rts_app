import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { DiceService } from '../Services/dice.service';
import * as moment from 'moment';
import { PageEvent } from '@angular/material';
import * as _ from 'underscore';
import { UserService } from '../Services/user.service';

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
  lowValue: number = 0;
  highValue: number = 10;
  selectedCandidates: any[];
  userDetails: any;
  selectedUser: any;

  constructor(
    private loggedUser: LoggedUserService,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private diceService: DiceService,
    private userService: UserService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.startDate = new Date(Date.now())
    this.endDate = new Date(Date.now())
    this.currentDate = new Date(Date.now())
    this.selectedUser = 0;
  }

  ngOnInit() {
    this.getActiveUser();
  }

  getActiveUser() {
    const userId = {
      userId: this.rtsUserId
    };

    this.userService.getActiveUsers(userId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.userDetails = data.users;
          }
        });
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  dateFilter() {
    this.ngProgress.start();
    this.selectedUser = 0;
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
            for (const candidate of this.candidates) {
              candidate.userId = candidate.enteredUser.userId;
            }
            this.selectedCandidates = this.candidates;
            this.candidatesLength = this.selectedCandidates.length;
          }
        });
  }

  filterByUser() {
    if (this.selectedUser !== undefined) {
      this.selectedCandidates = _.where(this.candidates, { userId: this.selectedUser });
      this.candidatesLength = this.selectedCandidates.length;
    }
    if (this.selectedUser === 0){
      this.selectedCandidates = this.candidates;
      this.candidatesLength = this.selectedCandidates.length;
    }
  }

}
