import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css'],
  providers: [LoggedUserService]
})
export class EditClientComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;

  public myForm: FormGroup;
  private clients: any;
  private clientId: any;
  private selectedClient: any;
  private phoneNumber: any;
  private email: any;
  private contactPersonEmail: any;
  private contactPersonName: any;
  private contactPersonNumber: any;
  private name: any;
  isCcEmpty: boolean;
  deletedRecruiter: any;

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private clientService: ClientService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.deletedRecruiter = [];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.clientId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      phoneNumber: [''],
      units: this.formBuilder.array([
      ]),
      ccUnits: this.formBuilder.array([
      ])
    });
    this.getAllClients();
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

  removeUnits(i: number, event) {
    const control = <FormArray>this.myForm.controls['units'];
    control.removeAt(i);
    this.deletedRecruiter.push(event.value.clientRecuriterId);
  }

  addCcUnits() {
    const control = <FormArray>this.myForm.controls['ccUnits'];
    control.push(this.initCcUnits());
  }

  removeCcUnits(i: number) {
    const control = <FormArray>this.myForm.controls['ccUnits'];
    control.removeAt(i);
  }

  getAllClients() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.clientService.allClients(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.clients = data.clients;
            this.selectedClient = _.findWhere(this.clients, { clientId: this.clientId });
            const control = <FormArray>this.myForm.controls['units'];
            for (const recruiter of this.selectedClient.toClientRecuriters) {
              control.push(this.formBuilder.group(recruiter));
            }
            const CcControl = <FormArray>this.myForm.controls['ccUnits'];
            for (const ccRecruiter of this.selectedClient.ccRecuriters) {
              CcControl.push(this.formBuilder.group(ccRecruiter));
            }
            if (this.selectedClient.ccRecuriters.length === 0) {
              CcControl.push(this.initCcUnits());
            }
            this.name = this.selectedClient.name;
            this.email = this.selectedClient.email;
            this.phoneNumber = this.selectedClient.phoneNumber;
          }
        });

  }

  updateClient(form: FormGroup) {
    for (const cc of form.value.ccUnits) {
      if (cc.name === '' || cc.email === '') {
        this.isCcEmpty = true;
      } else {
        this.isCcEmpty = false;
      }
    }
    this.ngProgress.start();

    const editClient: any = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      enteredBy: this.rtsUserId,
      clientId: this.clientId,
      toClientRecuriters: form.value.units,
    };

    if (form.value.ccUnits[0].name === '' || form.value.ccUnits[0].email === '') {
      editClient.ccRecuriters = [];
      this.isCcEmpty = false;
    } else {
      editClient.ccRecuriters = form.value.ccUnits;
    }

    if (this.isCcEmpty) {
      this.toastr.error('Please add valid cc details', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      this.ngProgress.done();
      return false;
    }

    const client = {
      client: editClient,
      deletedRecuriters: this.deletedRecruiter
    };

    this.clientService.editClient(client)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Updated successfully', '', {
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

