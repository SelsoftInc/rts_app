import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { NgProgress } from 'ngx-progressbar';
import { GraphExpansationComponent } from '../graph-expansation/graph-expansation.component';

@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.css'],
  providers: [LoggedUserService]
})
export class ManageClientComponent implements OnInit {
  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;
  private clients: any;
  private clientsLength: any;

  public myForm: FormGroup;
  constructor(
    private loggedUser: LoggedUserService,
    private clientService: ClientService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    GraphExpansationComponent.graphExpandDeatils = undefined;
    this.ngProgress.start();
    this.getAllClients();
  }

  getAllClients() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.clientService.allClients(companyId)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.clients = data.clients;
            this.clientsLength = this.clients.length;
          }
        });

  }

}
