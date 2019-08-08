import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TimeSheetService } from '../Services/timeSheet.service';
import { UserService } from '../Services/user.service';
import { RequirementsService } from '../Services/requirements.service';
import { MatDialog } from '@angular/material';
import { TimeSheetDetailsComponent } from '../time-sheet-details/time-sheet-details.component';
import { SendMailComponent } from '../send-mail/send-mail.component';

export interface DialogData {
  weekSheet: any;
  date: any;
  isProductivity: boolean;
}
export interface DialogMailData {
  daySheets: any;
}

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.css'],
  providers: [LoggedUserService]
})
export class TimeSheetComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private userRole: any;
  private startDate: any;
  private fromDate: Date
  private days: any[];
  private rtsCompanyId: any;
  selectedDays: any[];
  weekSheet: any;
  userDetails: any[];
  selectedUser: any;
  currentDate: Date;
  selectedDaysLength: number;
  selectedSheet: any;
  totalWorkingHours: any;
  totalProductivityHours: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private timeSheetService: TimeSheetService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.days = [];
    this.selectedDays = [];
    this.selectedSheet = [];
    this.selectedUser = this.rtsUserId;
    this.startDate = new Date(Date.now())
  }

  ngOnInit() {
    this.ngProgress.start();
    this.days[0] = "Sunday";
    this.days[1] = "Monday";
    this.days[2] = "Tuesday";
    this.days[3] = "Wednesday";
    this.days[4] = "Thursday";
    this.days[5] = "Friday";
    this.days[6] = "Saturday";
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

  dateFilter() {
    this.ngProgress.start();
    this.selectedDays = [];
    this.selectedSheet = [];
    this.currentDate = new Date(this.startDate);

    if (this.days[this.startDate.getDay()] == 'Sunday') {
      this.selectedDays.push({ 'dateId': moment(this.startDate).format('YYYY-MM-DD') });
      for (const day of this.days) {
        const days = this.startDate.setDate(this.startDate.getDate() + 1);
        this.selectedDays.push({ 'dateId': moment(days).format('YYYY-MM-DD') });
      }
      this.selectedDays.pop();
      this.selectedDaysLength = this.selectedDays.length;

      const days = {
        userId: this.selectedUser,
        daySheets: this.selectedDays
      };

      this.timeSheetService.getWeekSheet(days)
        .subscribe(data => {
          this.ngProgress.done();
          if (data.success) {
            this.weekSheet = data.weekSheet.daySheets;
            this.totalWorkingHours = data.weekSheet.totalWorkingHours;
            this.totalProductivityHours = data.weekSheet.totalProductivityHours;
            for (const sheet of this.weekSheet) {
              if (!sheet.workingHoursStr) {
                sheet.workingHoursStr = '0:0';
              }
              if (!sheet.productivityHoursStr) {
                sheet.productivityHoursStr = '0:0';
              }
            }
          }
        });
      for (const day of this.selectedDays) {
        this.selectedSheet.push(day.dateId)
      }

    } else {
      this.ngProgress.done();
      this.toastr.error('Please Select Sunday', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
    }
    this.startDate = this.currentDate;
  }

  getTimeDetails(dateId, isProductivity) {
    const dialogRef = this.dialog.open(TimeSheetDetailsComponent, {
      height: '500px',
      width: '1000px',
      data: { weekSheet: this.weekSheet, date: dateId, isProductivity: isProductivity }
    });

  }

  sendMail() {
    const dialogRef = this.dialog.open(SendMailComponent, {
      height: '800px',
      width: '1200px',
      data: { daySheets: this.selectedSheet }
    });

  }
}
