import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';
import { DiceService } from '../Services/dice.service';

@Component({
  selector: 'app-add-dice',
  templateUrl: './add-dice.component.html',
  styleUrls: ['./add-dice.component.css'],
  providers: [LoggedUserService]
})
export class AddDiceComponent implements OnInit {

  public myForm: FormGroup;
  rtsUser: any;
  rtsUserId: any;
  userRole: any;
  rtsCompanyId: any;

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private diceService: DiceService,
    private router: Router,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      userName: [''],
      password: ['']
    })
  }

  addDice(form: FormGroup) {
    this.ngProgress.start();
    const submit = {
      companyId: this.rtsCompanyId,
      userName: form.value.userName,
      password: form.value.password
    };

    this.diceService.addDice(submit)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.toastr.success('Dice Account Added', '', {
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
