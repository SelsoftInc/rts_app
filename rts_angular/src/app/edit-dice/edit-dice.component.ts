import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DiceService } from '../Services/dice.service';
import { NgProgress } from 'ngx-progressbar';
import * as _ from 'underscore';

@Component({
  selector: 'app-edit-dice',
  templateUrl: './edit-dice.component.html',
  styleUrls: ['./edit-dice.component.css']
})
export class EditDiceComponent implements OnInit {

  rtsUser: any;
  rtsUserId: any;
  rtsCompanyId: any;
  myForm: any;
  diceAccount: any;
  selectedDiceId: any
  selectedDiceObject: any;

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private diceService: DiceService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllDiceAccount();
    this.myForm = this.formBuilder.group({
      userName: ['', Validators.email],
      password: [''],
      diceAccount: ['']
    });
  }

  getAllDiceAccount() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.diceService.getAllDice(companyId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.diceAccount = data.diceInfo;
          }
        });
  }

  selectDice() {
    this.selectedDiceObject = _.findWhere(this.diceAccount, { diceId: parseInt(this.selectedDiceId) });
  }

  editDice(form: FormGroup) {
    this.ngProgress.start();
    const submit = {
      diceId: parseInt(this.selectedDiceId),
      companyId: this.rtsCompanyId,
      userName: form.value.userName,
      password: form.value.password
    };

    this.diceService.editDice(submit)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.toastr.success('Dice Account Updated', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['dice-view']);
          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }



}
