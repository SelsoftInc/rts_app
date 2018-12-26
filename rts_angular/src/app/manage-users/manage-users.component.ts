import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { NgProgress } from 'ngx-progressbar';
import { GraphExpansationComponent } from '../graph-expansation/graph-expansation.component';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [LoggedUserService]
})
export class ManageUsersComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private userDetails: any;
  private userLength: any;
  private rtsCompanyId: any;
  private userRole: any;
  sortedData: any;

  constructor(
    private loggedUser: LoggedUserService,
    private router: Router,
    private userService: UserService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
  }

  ngOnInit() {
    GraphExpansationComponent.graphExpandDeatils = undefined;
    this.ngProgress.start();
    if (this.userRole === 'ADMIN') {
      this.getManageUser();
    } else {
      this.getAllUser();
    }
  }

  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.userDetails = data.users;
            this.userLength = this.userDetails.length;
            this.sortedData = this.userDetails;
          }
        });

  }

  getManageUser() {
    const userId = {
      userId: this.rtsUserId
    };

    this.userService.manageUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.userDetails = data.users;
            this.userLength = this.userDetails.length;
            this.sortedData = this.userDetails;
          }
        });

  }

  sortData(sort: Sort) {
    const data = this.userDetails.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName': return this.compare(a.firstName, b.posifirstNametionName, isAsc);
        case 'lastName': return this.compare(a.lastName, b.lastName, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'role': return this.compare(a.role, b.role, isAsc);
        case 'status': return this.compare(a.userStatus, b.userStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
