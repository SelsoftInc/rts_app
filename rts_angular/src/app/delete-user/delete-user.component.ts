import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TeamService } from '../Services/team.service';
import { Router } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import * as _ from 'underscore';
import { UserService } from '../Services/user.service';
import { DialogData } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css'],
  providers: [LoggedUserService]
})
export class DeleteUserComponent implements OnInit {

  private userId: any;
  private userDetails: any;
  private rtsUserId: any;
  private rtsUser: any;
  private userName: any;
  private selectedUser: any;
  private rtsCompanyId: any;
  private firstName: any;
  private lastName: any;

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private toastr: ToastrService,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
  }

  ngOnInit() {
    this.getAllUser();
  }

  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.userDetails = data.users;
            this.selectedUser = _.findWhere(this.userDetails, { userId: this.data.userId });
            // console.log(this.selectedUser)
            this.firstName = this.selectedUser.firstName;
            this.lastName = this.selectedUser.lastName;
          }
        });
  }

  cancel() {
    this.dialogRef.close();
  }

  deleteUser() {

    this.userService.deleteUser(this.data)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Deleted Successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
            this.router.navigate(['manage-users']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.dialogRef.close();
          }
        });
  }

}
