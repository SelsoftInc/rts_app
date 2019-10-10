import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { ToastrService } from 'ngx-toastr';
import { TimeSheetService } from '../Services/timeSheet.service';
import { UserService } from '../Services/user.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from '../leave-manage/leave-manage.component';


@Component({
  selector: 'app-cancel-leave-request',
  templateUrl: './cancel-leave-request.component.html',
  styleUrls: ['./cancel-leave-request.component.css'],
  providers: [LoggedUserService]
})
export class CancelLeaveRequestComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private userRole: any;
  private rtsCompanyId: any;

  constructor(
    public dialogRef: MatDialogRef<CancelLeaveRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private toastr: ToastrService,
    private timeSheetService: TimeSheetService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  cancelLeaveRequest() {

    const submit = {
      daySheetId: this.data.dateId,
      userId: this.rtsUserId
    }

    this.timeSheetService.cancelLeaveRequest(submit)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
            this.router.navigate(['leave-manage']);
          }
          else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
          }
        });
  }

}



