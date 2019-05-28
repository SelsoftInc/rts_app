import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css'],
  providers: [LoggedUserService]
})
export class SendMailComponent implements OnInit {

  public myForm: FormGroup;
  static candidatesList: any[];
  rtsUserId: any;
  rtsUser: any;
  adminUsers: any[];
  customMailBody: any;
  selectedAdmins: any[];
  dropdownSettings: any;
  rtsCompanyId: any;
  adminUsersArray: any;
  users: any;
  rtsUserEmail: any;
  selectedCandidates: any[];


  constructor(
    private loggedUser: LoggedUserService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.rtsUserEmail = this.rtsUser.email;
    this.dropdownSettings = {};
    this.adminUsers = [];
    this.customMailBody = '';
    this.selectedAdmins = [];
    this.adminUsersArray = [];
    this.users = [];
    this.selectedCandidates = [];
  }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'email',
      textField: 'name',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.myForm = this.formBuilder.group({
      mailFrom: [''],
      mailTo: [''],
      mailCC: [''],
      mailBody: [''],
      mailSubject: ['']
    })
    this.getAllUser();

    if (SendMailComponent.candidatesList !== undefined) {
      for (const mail of SendMailComponent.candidatesList) {
        this.selectedCandidates.push(mail.email);
      }
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
              if (user.role === 'ADMIN') {
                this.adminUsers.push({ email: user.email, name: user.firstName + ' ' + user.lastName });
              }
            }
            // this.adminUsersArray = [{ email: 'pushban@selsoftinc.com', name: 'Pushban R' }];
          }
        });
  }

  sendMail(form: FormGroup) {
    console.log(form.value);
  }

}