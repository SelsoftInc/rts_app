import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
  providers: [LoggedUserService]
})
export class AddClientComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;

  public myForm: FormGroup;
  private isCcEmpty: boolean;
  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private clientService: ClientService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      phoneNumber: [''],
      units: this.formBuilder.array([
        this.initUnits()
      ]),
      ccUnits: this.formBuilder.array([
        this.initCcUnits()
      ])
    });
  }

  initUnits() {
    return this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      phoneNumber: [''],
    });
  }

  initCcUnits() {
    return this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
    });
  }

  addUnits() {
    const control = <FormArray>this.myForm.controls['units'];
    control.push(this.initUnits());
  }

  removeUnits(i: number) {
    const control = <FormArray>this.myForm.controls['units'];
    control.removeAt(i);
  }

  addCcUnits() {
    const control = <FormArray>this.myForm.controls['ccUnits'];
    control.push(this.initCcUnits());
  }

  removeCcUnits(i: number) {
    const control = <FormArray>this.myForm.controls['ccUnits'];
    control.removeAt(i);
  }

  addNewClient(form: FormGroup) {
    for (const cc of form.value.ccUnits) {
      if (cc.name === '' || cc.email === '') {
        this.isCcEmpty = true;
      } else {
        this.isCcEmpty = false;
      }
    }
    this.ngProgress.start();

    const client: any = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      enteredBy: this.rtsUserId,
      clientRecruiters: form.value.units,
    };

    if (form.value.ccUnits[0].name === '' || form.value.ccUnits[0].email === '') {
      client.ccRecruitersJSON = [];
      this.isCcEmpty = false;
    } else {
      client.ccRecruitersJSON = form.value.ccUnits;
    }

    if (this.isCcEmpty) {
      this.toastr.error('Please add valid cc details', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      this.ngProgress.done();
      return false;
    }

    this.clientService.addClient(client)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('New Client successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
            this.router.navigate(['manage-client']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
          }
        });

  }

}
