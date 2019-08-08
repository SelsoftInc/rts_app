import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../search-candidates/search-candidates.component';
import { TimeSheetService } from '../Services/timeSheet.service';
import { DialogMailData } from '../time-sheet/time-sheet.component';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css'],
  providers: [LoggedUserService]
})
export class SendMailComponent implements OnInit {

  public myForm: FormGroup;
  static mailToAddress: any[];
  rtsUserId: any;
  rtsUser: any;
  adminUsers: any[];
  customMailBody: any;
  selectedAdmins: any[];
  rtsCompanyId: any;
  adminUsersArray: any;
  users: any;
  rtsUserEmail: any;
  selectedMailId: any[];
  mailToAddress: any;
  addCustom = (item) => ({ email: item });
  selectedDays: any[];
  isMail: boolean;


  constructor(
    public dialogRef: MatDialogRef<SendMailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(MAT_DIALOG_DATA) public mailData: DialogMailData,
    private loggedUser: LoggedUserService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private timeSheetService: TimeSheetService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserEmail = this.rtsUser.email;
    this.adminUsers = [];
    this.customMailBody = '';
    this.selectedAdmins = [];
    this.adminUsersArray = [];
    this.users = [];
    this.selectedMailId = [];
    this.mailToAddress = [];
    this.selectedDays = [];
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      mailFrom: [''],
      mailTo: [''],
      mailCC: [''],
      mailBody: [''],
      mailSubject: ['']
    })
    this.getAllUser();

    if (this.data.mailTo !== undefined) {
      for (const mail of this.data.mailTo) {
        this.selectedMailId.push({ email: mail.email });
        this.mailToAddress.push(mail.email)
      }
    }
    if (this.mailData.daySheets === undefined) {
      this.isMail = true;
    } else {
      this.isMail = false;
    }
  }

  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.adminUsers = [];
            this.users = data.users;
            for (const user of this.users) {
              if (user.role === 'ADMIN' || user.role === 'ACC_MGR') {
                this.adminUsers.push({ email: user.email, name: user.firstName + ' ' + user.lastName });
              }
            }
            // this.adminUsersArray = [{ email: 'pushban@selsoftinc.com', name: 'Pushban R' }];
          }
        });
  }

  copied(event) {
    this.toastr.info('Text Copied', '', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000,
    });
  }

  sendMail(form: FormGroup) {
    // console.log(form.value);
    if (form.value.mailTo.length === 0) {
      this.toastr.error('Please Add To Addresss', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    if (form.value.mailSubject === '') {
      this.toastr.error('Please Add Subject', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    const submit = {
      userId: this.rtsUserId,
      daySheets: this.mailData.daySheets,
      to: form.value.mailTo,
      cc: form.value.mailCC,
      subject: form.value.mailSubject
    };

    this.timeSheetService.sendTimeSheet(submit)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
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
