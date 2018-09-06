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
  private currentDate: Date;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.currentDate = new Date(Date.now());
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
            for (const require of this.selectedRequirements) {
              const diff = Math.floor(this.currentDate.getTime() - require.createdOn);
              const day = 1000 * 60 * 60 * 24;
              const days = Math.floor(diff / day);
              const weeks = Math.floor(days / 7);
              const months = Math.floor(days / 31);
              const years = Math.floor(months / 12);
              if (days < 7) {
                require.age = days + ' days ago';
              } else if (weeks < 4) {
                require.age = weeks + ' weeks ago';
              } else if (months < 12) {
                require.age = months + ' months ago';
              } else {
                require.age = years + ' years ago';
              }
            }
          }
        });
  }

}
