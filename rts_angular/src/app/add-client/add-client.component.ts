import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';

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
  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private clientService: ClientService
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
      ])
    });
  }

  initUnits() {
    return this.formBuilder.group({
      clientRecruiterName: [''],
      clientRecruiterEmail: [''],
      clientRecruiterNumber: [''],
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

  addNewClient(form: FormGroup) {

    const client = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      contactPersonName: form.value.clientContactName,
      contactPersonEmail: form.value.clientContactEmail,
      contactPersonNumber: form.value.clientContactNumber,
      enteredBy: this.rtsUserId
    };

    this.clientService.addClient(client)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('New Client successfully added', '', {
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
