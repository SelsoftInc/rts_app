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
  private requirementsLength: any;
  private selectedRequirements: any;
  private fromDate: any;
  private toDate: any;

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
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      });
    this.getClientRequirements();
  }

  getClientRequirements() {

    const userId = {
      clientId: this.clientId,
      fromDate: this.fromDate,
      toDate: this.toDate
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
