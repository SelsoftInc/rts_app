import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';

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

  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private clientService: ClientService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.clientId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      phoneNumber: [''],
      units: this.formBuilder.array([
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

  addUnits() {
    const control = <FormArray>this.myForm.controls['units'];
    control.push(this.initUnits());
  }

  removeUnits(i: number) {
    const control = <FormArray>this.myForm.controls['units'];
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
            this.clients = data.clients;
            this.selectedClient = _.findWhere(this.clients, { clientId: this.clientId });
            const control = <FormArray>this.myForm.controls['units'];
            for (const recruiter of this.selectedClient.clientRecuriters) {
              control.push(this.formBuilder.group(recruiter));
            }
            this.name = this.selectedClient.name;
            this.email = this.selectedClient.email;
            this.phoneNumber = this.selectedClient.phoneNumber;
          }
        });

  }

  updateClient(form: FormGroup) {

    const editClient = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      enteredBy: this.rtsUserId,
      clientId: this.clientId,
      clientRecuriters: form.value.units
    };

    this.clientService.editClient(editClient)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Updated successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['manage-client']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }
}

