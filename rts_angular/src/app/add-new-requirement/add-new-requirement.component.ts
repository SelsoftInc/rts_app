import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../Services/user.service';
import { ClientService } from '../Services/client.service';

@Component({
  selector: 'app-add-new-requirement',
  templateUrl: './add-new-requirement.component.html',
  styleUrls: ['./add-new-requirement.component.css'],
  providers: [LoggedUserService]
})
export class AddNewRequirementComponent implements OnInit {

  public myForm: FormGroup;
  private rtsUser: any;
  private rtsUserId: any;
  private requirementType: any;
  private userDetails: any;
  private newRequirement: any;
  private requirementByUser: any;
  private immigrationByUser: any;
  private rtsCompanyId: any;
  private clients: any;
  private immigration: any;
  private teams: any;
  private requirementStatus: any;
  private positions: any;
  private accounts: any;
  private isOtherAccountName: boolean;
  private isOtherPositionName: boolean;
  private technologies: any;
  private isOtherTechnology: boolean;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private clientService: ClientService
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.requirementType = ['C2C', 'FTE', 'TBD'];
    this.immigration = ['GC', 'CITIZEN', 'H1B'];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'open' },
      { 'name': 'In-Progress', 'value': 'inprogress' },
      { 'name': 'Closed', 'value': 'closed' }
    ];
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      positionName: ['', Validators.required],
      otherPositionName: [''],
      otherAccountName: [''],
      clientName: [''],
      accountName: [''],
      status: [''],
      bankName: ['', Validators.required],
      priority: [''],
      location: [''],
      requirementType: ['', Validators.required],
      positionsCount: [''],
      immigrationRequirement: [''],
      technologies: [''],
      allocation: [''],
      clientRate: [''],
      sellingRate: [''],
      jobDescription: [''],
      team: [''],
      comments: [''],
      otherTechnology: ['']
    });
    this.getAllUsers();
    this.getCommonDetails();
  }

  getCommonDetails() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.clients = data.clients;
            this.technologies = data.technologies;
            this.accounts = data.accounts;
            this.positions = data.positions;
            this.teams = data.teams;
          }
        });
  }


  getAllUsers() {
    const userId = {
      enteredBy: this.rtsUserId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.userDetails = data.users;
          }
        });

  }

  getCheckedRequirementType(type) {
    if (this.requirementByUser.indexOf(type) === -1) {
      this.requirementByUser.push(type);
    } else {
      this.requirementByUser.splice(this.requirementByUser.indexOf(type), 1);
    }
    console.log(this.requirementByUser);
  }

  getCheckedImmigrationValue(data) {
    if (this.immigrationByUser.indexOf(data) === -1) {
      this.immigrationByUser.push(data);
    } else {
      this.immigrationByUser.splice(this.immigrationByUser.indexOf(data), 1);
    }
    console.log(this.immigrationByUser);
  }

  changePositionName(event) {
    if (event === 'other') {
      this.isOtherPositionName = true;
    } else {
      this.myForm.controls.otherPositionName.setValue('');
      this.isOtherPositionName = false;
    }
  }

  changeAccountName(event) {
    if (event === 'other') {
      this.isOtherAccountName = true;
      this.myForm.controls.otherAccountName.setValue('');
    } else {
      this.isOtherAccountName = false;
    }
  }

  addTechnology(event) {
    if (event === 'other') {
      this.isOtherTechnology = true;
      this.myForm.controls.otherTechnology.setValue('');
    } else {
      this.isOtherTechnology = false;
    }
  }

  addNewRequirement(form: FormGroup) {

    if (form.value.clientRate === '' || form.value.clientRate === null) {
      this.toastr.error('Client Rate should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (form.value.sellingRate === '' || form.value.sellingRate === null) {
      this.toastr.error('Selling Rate should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    const requirement: any = {
      priority: form.value.priority,
      location: form.value.location,
      requirementType: this.requirementByUser,
      immigrationRequirement: this.immigrationByUser,
      positionCount: form.value.positionsCount,
      status: form.value.status,
      enteredBy: this.rtsUserId,
      clientId: form.value.clientName,
      allocationUserId: form.value.allocation,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      jobDescription: form.value.jobDescription,
      teamId: form.value.team,
    };

    if (form.value.positionName === 'other') {
      requirement.position = {
        positionName: form.value.otherPositionName
      };
    } else {
      requirement.positionId = form.value.positionName;
    }

    if (form.value.accountName === 'other') {
      requirement.account = {
        accountName: form.value.otherAccountName
      };
    } else {
      requirement.accountId = form.value.accountName;
    }

    if (form.value.technologies === 'other') {
      requirement.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      requirement.technology = [{
        technologyId: form.value.technologies
      }];
    }

    this.newRequirement = requirement;
    console.log(this.newRequirement);

    this.requirementService.addRequirements(this.newRequirement)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('New requirement successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['requirements']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
