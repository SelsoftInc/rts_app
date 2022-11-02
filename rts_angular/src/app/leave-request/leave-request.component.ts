import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { TimeSheetService } from '../Services/timeSheet.service';
import { UserService } from '../Services/user.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LeaveAlertComponent } from '../leave-alert/leave-alert.component';


export interface DialogData {
  leaveRequest: any;
}

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  providers: [LoggedUserService]
})
export class LeaveRequestComponent implements OnInit {

  public myForm: FormGroup;
  private rtsUser: any;
  private rtsUserId: any;
  private userRole: any;
  private startDate: any;
  private comboDate: any;
  private leaveDays: any[];
  private mailToAddress: any;
  addCustom = (item) => ({ email: item });
  selectedMailId: any;
  rtsCompanyId: any;
  currentDate: Date;
  // isLeave: boolean;
  userDetails: any;
  isComboLeave: boolean;
  date: Date;
  sickLeaveCount: number;
  casualLeaveCount: number;
  leaveDetails: any;
  isLeaveRequest: boolean;
  isLeaveAlertApprove: boolean;
  isSickLeave: boolean;
  isCasualLeave: boolean;
  // selectedUser: any;


  constructor(
    private loggedUser: LoggedUserService,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private timeSheetService: TimeSheetService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.leaveDays = [];
    this.mailToAddress = [];
    this.currentDate = new Date(Date.now());
    this.date = new Date();
    this.isComboLeave = false;
    this.date.setMonth(this.currentDate.getMonth());
    this.date.setDate(1);
    this.isLeaveRequest = false;
    // this.casualLeaveCount= 12;
    // this.sickLeaveCount=6;
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      mailFrom: [''],
      comboDate: [''],
      mailTo: [''],
      mailBody: [''],
      isLeave: [''],
      leaveType: [''],
      selectUser: ['']
    })
    this.getAllUser();
    this.getLeaveRequests();
    this.mailToAddress.push('pushban@selsoftinc.com', 'murali@selsoftinc.com', 'ramesh.iyengar@selsoftinc.com','vanaja@selsoftinc.com');
  }

  getLeaveRequests() {

    const dateId = moment(this.currentDate).format('YYYY');

    const userId = {
      userId: this.rtsUserId,
      dateId: dateId,
    };

    this.timeSheetService.leaveHistory(userId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.leaveDetails = data.daySheets;
            this.sickLeaveCount = this.leaveDetails.sickLeave.length;
            this.casualLeaveCount = this.leaveDetails.casualLeave.length;
          }
        });
  }



  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.selectedMailId = [];
            for (const user of data.users) {
              if (user.role === 'ADMIN' || user.role === 'ACC_MGR' || user.role === 'HR_MANAGER') {
                this.selectedMailId.push({ email: user.email, name: user.firstName + ' ' + user.lastName });
              }
            }

          }
        });
  }

  changeLeaveType(event) {
    if (event === 'Casual-Leave') {
      this.isCasualLeave = true;
      this.isSickLeave = false;
    }
    if (event === 'Sick-Leave') {
      this.isSickLeave = true;
      this.isCasualLeave = false;
    }
    if (event === 'Combo-Off') {
      this.isComboLeave = true;
    } else {
      this.isComboLeave = false;
    }
  }

  sendMail(form: FormGroup) {

    if (this.startDate === undefined || this.startDate === null) {
      this.toastr.error('Select Date', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (form.value.mailTo.length === 0) {
      this.toastr.error('Please Add To Mail Address', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    const fromDate = this.startDate.begin;
    const toDate = this.startDate.end;
    var timeDiff = Math.abs(fromDate.getTime() - toDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    this.leaveDays = [];
    var days = [];
    var date = fromDate;

    if (moment(fromDate).format('d') !== '0') {
      if (moment(fromDate).format('d') !== '6') {
        this.leaveDays.push(moment(fromDate).format('YYYY-MM-DD'));
      }
    }
    for (var i = 1; i < diffDays; i++) {
      var day = moment(date).format('YYYY-MM-DD');
      date = moment(day).add(1, 'days');
      days.push(moment(date).format('YYYY-MM-DD'));
    }
    for (const d of days) {
      var leaveDay = moment(d).format('d');
      if (leaveDay !== '0') {
        if (leaveDay !== '6') {
          this.leaveDays.push(d);
        }
      }
    }

    var mailBody = form.value.mailBody;
    if (mailBody === undefined) {
      mailBody = '';
    }
    const submit = {
      userId: this.rtsUserId,
      leaveType: form.value.leaveType,
      daySheets: this.leaveDays,
      mailTo: form.value.mailTo,
      comment: mailBody
    };

    this.getLeaveRequests();
    var sickCount;
    var casualCount
    sickCount = this.leaveDays.length + this.sickLeaveCount;
    casualCount = this.leaveDays.length + this.casualLeaveCount;
    if (this.isSickLeave && !this.isCasualLeave) {
      if (sickCount > 6) {
        this.isLeaveAlertApprove = true;
        const dialogRef = this.dialog.open(LeaveAlertComponent, {
          width: '500px',
          data: { leaveRequest: submit }
        });
      } else {
        this.isLeaveAlertApprove = false;
      }
    }
    if (this.isCasualLeave && !this.isSickLeave) {
      if (casualCount > 12) {
        this.isLeaveAlertApprove = true;
        const dialogRef = this.dialog.open(LeaveAlertComponent, {
          width: '500px',
          data: { leaveRequest: submit }
        });
      } else {
        this.isLeaveAlertApprove = false;
      }
    }


    if (!this.isLeaveAlertApprove) {
      this.timeSheetService.leaveRequest(submit)
        .subscribe(
          data => {
            if (data.success) {
              this.toastr.success(data.message, '', {
                positionClass: 'toast-top-center',
                timeOut: 3000,
              });
              this.router.navigate(['time-sheet']);
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

}
