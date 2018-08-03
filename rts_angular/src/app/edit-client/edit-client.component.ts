import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      clientContactName: [''],
      clientContactEmail: [''],
      clientContactNumber: ['']
    });
    this.getAllClients();
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
            for (const user of this.clients) {
              this.selectedClient = _.findWhere(this.clients, { clientId: this.clientId });
            }
            this.name = this.selectedClient.name;
            this.email = this.selectedClient.email;
            this.phoneNumber = this.selectedClient.phoneNumber;
            this.contactPersonName = this.selectedClient.contactPersonName;
            this.contactPersonEmail = this.selectedClient.contactPersonEmail;
            this.contactPersonNumber = this.selectedClient.contactPersonNumber;
          }
        });

  }

  updateClient(form: FormGroup) {

    const editClient = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      contactPersonName: form.value.clientContactName,
      contactPersonEmail: form.value.clientContactEmail,
      contactPersonNumber: form.value.clientContactNumber,
      enteredBy: this.rtsUserId,
      clientId: this.clientId
    };

    this.clientService.editClient(editClient)
      .subscribe(
        data => {
          console.log(data);
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

