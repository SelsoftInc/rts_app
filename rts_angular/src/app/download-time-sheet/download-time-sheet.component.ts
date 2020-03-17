import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'underscore';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { TimeSheetService } from '../Services/timeSheet.service';
import { TableUtil } from "./tableUtil";

@Component({
  selector: 'app-download-time-sheet',
  templateUrl: './download-time-sheet.component.html',
  styleUrls: ['./download-time-sheet.component.css'],
  providers: [LoggedUserService]
})
export class DownloadTimeSheetComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private userRole: any;
  private toDate: any;
  private fromDate: Date;
  private date: Date;
  selectedDays: any[];
  selectedReport: any;
  daySheets: any;
  selectedDate: any;
  isTableData: boolean;

  constructor(
    public dialogRef: MatDialogRef<DownloadTimeSheetComponent>,
    private loggedUser: LoggedUserService,
    private timeSheetService: TimeSheetService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.fromDate = new Date(Date.now())
    this.toDate = new Date(Date.now())
    this.date = new Date(Date.now())
    this.selectedDate = moment(this.fromDate).format('MMMM DD, YYYY');
    this.selectedDays = [];
    this.isTableData = false;
    this.selectedReport = [];
  }

  ngOnInit() {
  }

  getReport() {

    this.selectedDays = [];
    var a = moment(this.fromDate);
    var b = moment(this.toDate);
    var days = b.diff(a, 'days');

    const date = this.fromDate.setDate(this.fromDate.getDate());
    const dateId = moment(date).format('YYYY-MM-DD')
    const isLeave = this.isWeekend(dateId);
    this.selectedDays.push({ 'dateId': moment(this.fromDate).format('YYYY-MM-DD'), 'leave': isLeave });

    for (var day = 0; day < days; day++) {
      const date = this.fromDate.setDate(this.fromDate.getDate() + 1);
      const dateId = moment(date).format('YYYY-MM-DD')
      const isLeave = this.isWeekend(dateId);
      this.selectedDays.push({ 'dateId': moment(dateId).format('YYYY-MM-DD'), 'leave': isLeave });
    }

    let userId = {
      userId: this.rtsUserId,
      daySheets: this.selectedDays
    };

    this.timeSheetService.getReport(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.daySheets = data.daySheets;
            setTimeout(() => {
              this.isTableData = true;
            }, 800);
          }
        });
  }

  downloadReport() {
    TableUtil.exportToExcel("ExampleTable",this.selectedDate);
    this.dialogRef.close();
  }

  isWeekend(dateString) {
    var dateArray = dateString.split("-");
    var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    var day = date.getDay();
    return day === 0 || day === 6;
  }

}
