import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';
import { DiceService } from '../Services/dice.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dice-login',
  templateUrl: './dice-login.component.html',
  styleUrls: ['./dice-login.component.css'],
  providers: [LoggedUserService]
})
export class DiceLoginComponent implements OnInit {

  public myForm: FormGroup;
  rtsUser: any;
  rtsUserId: any;
  userRole: any;
  rtsCompanyId: any;
  diceAccount: any;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<DiceLoginComponent>,
    private loggedUser: LoggedUserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private diceService: DiceService,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      userEmail: ['', Validators.required],
      userPassword: ['', Validators.required]
    });
    // this.getAllDiceAccount();
  }

  // getAllDiceAccount() {
  //   const companyId = {
  //     companyId: this.rtsCompanyId
  //   };

  //   this.diceService.getAllDice(companyId)
  //     .subscribe(
  //       data => {
  //         if (data.success) {
  //           this.diceAccount = data.diceInfo;
  //         }
  //       });
  // }

  diceLogin(form: FormGroup) {
    console.log(form)
    this.dialogRef.close();
    this.router.navigate(['dice-view']);
  }

}
