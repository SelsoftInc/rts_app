import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TeamService } from '../Services/team.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
  providers: [LoggedUserService]
})
export class AddTeamComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;

  public myForm: FormGroup;
  private users: any;
  private teamMembers: any;
  private otherUsers: any;
  private dropdownSettings: any;
  isCheck: boolean;
  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.teamMembers = [];
    this.otherUsers = [];
    this.dropdownSettings = {};
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      teamName: [''],
      teamLeadUser: [''],
      teamMembers: [''],
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user',
      textField: 'firstName',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
            this.users = data.users;
          }
        });
  }

  selectTeamLead(event) {
    this.otherUsers = [];
    this.teamMembers = [];
    for (const user of this.users) {
      if (user.userId !== event) {
        this.otherUsers.push({ user: user, firstName: user.firstName + ' ' + user.lastName });
      }
    }
    this.deSelectAll();
  }

  onItemSelect(item: any) {
    if (item !== undefined && item !== '') {
      this.teamMembers.push(item.user.userId);
    }
  }

  onItemDeSelect(items: any) {
    const clear = this.teamMembers.indexOf(items);
    this.teamMembers.splice(clear, 1);
  }

  deSelectAll() {
    this.myForm.controls.teamMembers.setValue('');
  }

  addNewTeam(form: FormGroup) {

    const team = {
      teamName: form.value.teamName,
      leadUserId: form.value.teamLeadUser,
      otherUsers: this.teamMembers
    };
    console.log(team);

    this.teamService.addTeam(team)
      .subscribe(
        data => {
          console.log(data);
          if (data.success) {
            this.toastr.success('New Team successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['manage-team']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
