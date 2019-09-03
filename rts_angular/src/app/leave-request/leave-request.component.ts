import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { TimeSheetService } from '../Services/timeSheet.service';
import { UserService } from '../Services/user.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

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
  private leaveDays: any[];
  private mailToAddress: any;
  addCustom = (item) => ({ email: item });
  selectedMailId: any;
  rtsCompanyId: any;
  currentDate: Date;
  // isLeave: boolean;
  userDetails: any;
  // selectedUser: any;


  constructor(
    private loggedUser: LoggedUserService,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private timeSheetService: TimeSheetService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    // this.selectedUser = this.rtsUserId;
    this.leaveDays = [];
    this.mailToAddress = [];
    this.currentDate = new Date(Date.now())
    // this.isLeave = true;
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      mailFrom: [''],
      mailTo: [''],
      mailBody: [''],
      isLeave: [''],
      leaveType: [''],
      selectUser: ['']
    })
    this.getAllUser();
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
    var date = fromDate;
    for (var i = 0; i < diffDays; i++) {
      var day = moment(date).format('YYYY-MM-DD');
      this.leaveDays.push(day);
      date = moment(day).add(1, 'days');
    }

    var mailBody = form.value.mailBody;
    if (mailBody === undefined) {
      mailBody = '';
    }
    const submit = {
      userId: this.rtsUserId,
      // isLeave: this.isLeave,
      leaveType: form.value.leaveType,
      daySheets: this.leaveDays,
      mailTo: form.value.mailTo,
      comment: mailBody
    };

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

  cancelRequest(form: FormGroup) {

    if (this.startDate === undefined || this.startDate === null) {
      this.toastr.error('Select Date', '', {
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
    var date = fromDate;
    for (var i = 0; i < diffDays; i++) {
      var day = moment(date).format('YYYY-MM-DD');
      this.leaveDays.push(day);
      date = moment(day).add(1, 'days');
    }

    const submit = {
      enteredBy: this.rtsUserId,
      daySheets: this.leaveDays,
      userId: parseInt(form.value.selectUser)
    };

    this.timeSheetService.cancelLeaveRequest(submit)
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
