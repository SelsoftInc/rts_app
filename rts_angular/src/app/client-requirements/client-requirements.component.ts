import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-client-requirements',
  templateUrl: './client-requirements.component.html',
  styleUrls: ['./client-requirements.component.css'],
  providers: [LoggedUserService]
})
export class ClientRequirementsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private clientId: any;
  private date: any;
  private requirementsLength: any;
  private selectedRequirements: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.clientId = params['id'];
        this.date = params['date'];
      });
    this.getClientRequirements();
  }

  getClientRequirements() {

    const userId = {
      clientId: this.clientId,
      fromDate: this.date,
      toDate: this.date
    };

    this.clientService.getClientRequirements(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.selectedRequirements = data.requirements;
            this.requirementsLength = this.selectedRequirements.length;

          }
        });
  }

}
