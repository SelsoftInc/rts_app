import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { VendorService } from '../Services/vendor.service';
import * as _ from 'underscore';
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';


@Component({
  selector: 'app-vendor-mail',
  templateUrl: './vendor-mail.component.html',
  styleUrls: ['./vendor-mail.component.css'],
  providers: [LoggedUserService]
})
export class VendorMailComponent implements OnInit {

  vendorEmailsArray: any[];

  public myForm: FormGroup;
  rtsUserId: any;
  rtsUser: any;
  adminUsers: any[];
  customMailBody: any;
  selectedAdmins: any[];
  rtsCompanyId: any;
  adminUsersArray: any;
  users: any;
  rtsUserEmail: any;
  selectedVendors: any[];
  vendorsList: any;
  selected: any[];
  vendorEmails: any;
  vendorArray: any;
  items$ = new EventEmitter<any[]>();

  constructor(
    private loggedUser: LoggedUserService,
    private userService: UserService,
    private vendorService: VendorService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
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
    this.selectedVendors = [];
    this.vendorsList = [];
    this.selected = [];
    this.vendorEmails = [];
    this.vendorEmailsArray = []
  }

  ngOnInit() {
    this.ngProgress.start();

    this.myForm = this.formBuilder.group({
      mailFrom: [''],
      mailTo: [''],
      mailCC: [''],
      mailBody: [''],
      mailSubject: ['']
    })
    this.getAllVendors();
    this.getAllUser();

  }

  getAllVendors() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.vendorService.getAllVendors(userId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.vendorsList = data.vendors;
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
            this.adminUsers = [];
            this.users = data.users;
            for (const user of this.users) {
              if (user.role === 'ADMIN') {
                this.adminUsers.push({ email: user.email, name: user.firstName + ' ' + user.lastName });
              }
            }
            // this.adminUsers = [{ email: 'pushban@selsoftinc.com', name: 'Pushban R' }];
          }
        });
  }

  copied(event) {
    this.toastr.info('Text Copied', '', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000,
    });
  }

  getVendor() {

    if (this.selected.length > 0) {
      this.vendorEmailsArray = [];
      this.selectedVendors = [];
      this.vendorEmails = [];
      for (const id of this.selected) {
        const vendorEmail = _.findWhere(this.vendorsList, { vendorId: parseInt(id) });
        const isVendorExiting = _.findIndex(this.selectedVendors, vendorEmail)
        if (isVendorExiting === -1) {
          this.selectedVendors.push(vendorEmail);
        }
      }
      for (const vendor of this.selectedVendors) {
        for (const mail of vendor.vendorEmails) {
          const isVendorExiting = _.findIndex(this.vendorEmailsArray, { email: mail })
          if (isVendorExiting === -1) {
            this.vendorEmailsArray.push({ email: mail });
            this.vendorEmails.push(mail)
          }
        }
      }
      this.items$.next(this.vendorEmailsArray);
    }

  }

  // onSelectAll() {   
  //   this.selected = this.vendorsList.map(x => x.vendorId);
  // }

  // onClearAll() {
  //   this.selected = [];
  // }

  sendMail(form: FormGroup) {
    console.log(form.value);
  }

}
