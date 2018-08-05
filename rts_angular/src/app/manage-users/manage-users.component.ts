import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';

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

  constructor(
    private loggedUser: LoggedUserService,
    private router: Router,
    private userService: UserService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    const userId = {
      enteredBy: this.rtsUserId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.userDetails = data.users;
            console.log(this.userDetails);
            this.userLength = this.userDetails.length;
          }
        });

  }

}
