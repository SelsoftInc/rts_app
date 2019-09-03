import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { ActivatedRoute } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { TimeSheetService } from '../Services/timeSheet.service';
import * as moment from 'moment';
import { UserService } from '../Services/user.service';
import * as _ from 'underscore';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-timesheet-report',
  templateUrl: './timesheet-report.component.html',
  styleUrls: ['./timesheet-report.component.css'],
  providers: [LoggedUserService]
})
export class TimesheetReportComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private userRole: any;
  private startDate: any;
  private fromDate: Date
  private currentDate: Date
  private rtsCompanyId: any;
  private selectedTimeSheet: any;
  userDetails: any[];
  selectedUser: any;
  selectedTimeSheetLength: any;
  selectedReport: any[];
  selectedDate: any;
  selectedDays: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private timeSheetService: TimeSheetService,
    private userService: UserService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.selectedTimeSheet = [];
    this.startDate = new Date(Date.now())
    this.currentDate = new Date(Date.now())
    this.selectedUser = this.rtsUserId;
    this.selectedDays = [];
  }

  ngOnInit() {
    this.ngProgress.start();
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

  // selectUser(event) {
  //   const selected = _.findWhere(this.userDetails, { userId: event });
  //   this.selectedUserName = selected.firstName + ' ' + selected.lastName;
  // }

  dateFilter() {
    this.selectedDays = [];
    const currentDay = new Date(this.startDate);
    this.selectedDate = moment(currentDay).format('MMMM DD, YYYY');
    if (currentDay.getDay() === 0) {
      this.ngProgress.start();
      this.selectedDays.push({ 'dateId': moment(this.startDate).format('YYYY-MM-DD'), 'leave': true });
      for (var day = 0; day < 7; day++) {
        const days = this.startDate.setDate(this.startDate.getDate() + 1);
        this.selectedDays.push({ 'dateId': moment(days).format('YYYY-MM-DD'), 'leave': false });
      }
      this.selectedDays.pop();
      this.selectedDays[6].leave = true;

      const days = {
        userId: this.rtsUserId,
        daySheets: this.selectedDays
      };

      this.timeSheetService.getAllWeekSheet(days)
        .subscribe(data => {
          this.ngProgress.done();
          if (data.success) {
            this.selectedTimeSheet = data.daySheets;
            this.selectedTimeSheetLength = this.selectedTimeSheet.length;
          } else {
            this.selectedTimeSheet = [];
            this.selectedTimeSheetLength = 0;
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
    } else {
      this.toastr.error('Please Select Sunday', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
    }
    this.startDate = currentDay;
  }

  getTimeSheetReport() {
    this.selectedReport = [];
    for (const sheet of this.selectedTimeSheet) {
      this.selectedReport.push({
        'Employee Name': sheet.firstName + ' ' + sheet.lastName,
        'Sunday': sheet.day0.workingHours,
        'Monday': sheet.day1.workingHours,
        'Tuesday': sheet.day2.workingHours,
        'Wednesday': sheet.day3.workingHours,
        'Thursday': sheet.day4.workingHours,
        'Friday': sheet.day5.workingHours,
        'Saturday': sheet.day6.workingHours,
        'WorkingHours': sheet.totalWorkingHours,
        'ProductivityHours': sheet.totalProductivityHours,
        'LeaveCount': sheet.leaveCount
      });
    }
    const day0 = this.selectedTimeSheet[0].day0.dateId;
    const day1 = this.selectedTimeSheet[0].day1.dateId;
    const day2 = this.selectedTimeSheet[0].day2.dateId;
    const day3 = this.selectedTimeSheet[0].day3.dateId;
    const day4 = this.selectedTimeSheet[0].day4.dateId;
    const day5 = this.selectedTimeSheet[0].day5.dateId;
    const day6 = this.selectedTimeSheet[0].day6.dateId;

    this.selectedReport.map(function (obj) {
      obj['Sunday' + ' (' + day0 + ')'] = obj['Sunday'];
      delete obj['Sunday'];
      obj['Monday' + ' (' + day1 + ')'] = obj['Monday'];
      delete obj['Monday'];
      obj['Tuesday' + ' (' + day2 + ')'] = obj['Tuesday'];
      delete obj['Tuesday'];
      obj['Wednesday' + ' (' + day3 + ')'] = obj['Wednesday'];
      delete obj['Wednesday'];
      obj['Thursday' + ' (' + day4 + ')'] = obj['Thursday'];
      delete obj['Thursday'];
      obj['Friday' + ' (' + day5 + ')'] = obj['Friday'];
      delete obj['Friday'];
      obj['Saturday' + ' (' + day6 + ')'] = obj['Saturday'];
      delete obj['Saturday'];
      obj['Working Hours'] = obj['WorkingHours'];
      delete obj['WorkingHours'];
      obj['Productivity Hours'] = obj['ProductivityHours'];
      delete obj['ProductivityHours'];
      obj['Leave Count'] = obj['LeaveCount'];
      delete obj['LeaveCount'];
      return obj;
    });
    const data = this.selectedReport;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, this.selectedDate + '.xlsx', { bookType: 'xlsx', type: 'buffer' });
  }

}
