import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../Services/user.service';
import { ClientService } from '../Services/client.service';
import * as _ from 'underscore';

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
  private selectedTeamUsers: any;
  private selectedTeam: any;
  private userRole: any;
  private isRecruiters: boolean;
  private dropdownSettings: any;
  private recruitersArray: any;
  private selectedRecruites: any;
  selectedClient: any;

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
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.isRecruiters = false;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedTeamUsers = [];
    this.selectedRecruites = [];
    this.recruitersArray = [];
    this.dropdownSettings = {};
    this.requirementType = ['C2C', 'FTE', 'TBD'];
    this.immigration = ['GC', 'CITIZEN', 'H1B', 'W2/1099', 'OPT/CPT', 'EAD', 'H4AD'];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'Open' },
      { 'name': 'In-Progress', 'value': 'In-Progress' },
      { 'name': 'Closed', 'value': 'Closed' }
    ];
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      positionName: [''],
      otherPositionName: [''],
      otherAccountName: [''],
      clientName: [''],
      accountName: [''],
      status: [''],
      bankName: [''],
      priority: [''],
      location: [''],
      requirementType: [''],
      positionsCount: ['', Validators.pattern('^[0-9]*$')],
      immigrationRequirement: [''],
      technologies: [''],
      allocation: [''],
      clientRate: [''],
      sellingRate: [''],
      jobDescription: [''],
      team: [''],
      comments: [''],
      notes: [''],
      otherTechnology: [''],
      recruitersName: ['']
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
    this.getAllUsers();
    this.getCommonDetails();
  }

  getCommonDetails() {
    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(userId)
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

  saveFormData(form: FormGroup) {

    if (form.value.positionName === '' || form.value.positionName === null) {
      this.toastr.error('Position Name should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (form.value.clientName === '' || form.value.clientName === null) {
      this.toastr.error('Client Name should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (form.value.team === '' || form.value.team === null) {
      this.toastr.error('Team should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    if (form.value.technologies === '' || form.value.technologies === null) {
      this.toastr.error('Technologies should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }


    const saveRequirement: any = {
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
      note: form.value.notes,
      client: {
        clientId: form.value.clientName,
        clientRecuriters: this.selectedRecruites
      }
    };

    if (form.value.positionName === 'other') {
      saveRequirement.position = {
        positionName: form.value.otherPositionName
      };
    } else {
      saveRequirement.positionId = form.value.positionName;
    }

    if (form.value.accountName === 'other') {
      saveRequirement.account = {
        accountName: form.value.otherAccountName
      };
    } else {
      saveRequirement.accountId = form.value.accountName;
    }

    if (form.value.technologies === 'other') {
      saveRequirement.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      saveRequirement.technology = [{
        technologyId: form.value.technologies
      }];
    }

    this.requirementService.saveRequirement(saveRequirement)
      .subscribe(
        data => {
          if (data.success) {
            this.router.navigate(['requirements']);
          }
        });
    return false;
  }

  getCheckedRequirementType(type) {
    if (this.requirementByUser.indexOf(type) === -1) {
      this.requirementByUser.push(type);
    } else {
      this.requirementByUser.splice(this.requirementByUser.indexOf(type), 1);
    }
  }

  getCheckedImmigrationValue(data) {
    if (this.immigrationByUser.indexOf(data) === -1) {
      this.immigrationByUser.push(data);
    } else {
      this.immigrationByUser.splice(this.immigrationByUser.indexOf(data), 1);
    }
  }

  changePositionName(event) {
    if (event === 'other') {
      this.isOtherPositionName = true;
      this.myForm.controls.otherPositionName.setValue('');
    } else {
      this.myForm.controls.otherPositionName.setValue(event);
      this.isOtherPositionName = false;
    }
  }

  changeAccountName(event) {
    if (event === 'other') {
      this.isOtherAccountName = true;
      this.myForm.controls.otherAccountName.setValue('');
    } else {
      this.myForm.controls.otherAccountName.setValue(event);
      this.isOtherAccountName = false;
    }
  }

  addTechnology(event) {
    if (event === 'other') {
      this.isOtherTechnology = true;
      this.myForm.controls.otherTechnology.setValue('');
    } else {
      this.myForm.controls.otherTechnology.setValue(event);
      this.isOtherTechnology = false;
    }
  }

  selectTeam(event) {
    if (event !== '') {
      this.selectedTeam = _.findWhere(this.teams, { teamId: event });
      this.selectedTeamUsers.push(this.selectedTeam.leadUser);
      for (const user of this.selectedTeam.otherUsers) {
        this.selectedTeamUsers.push(user);
      }
    }
  }

  getClientRecruiters(event) {
    this.recruitersArray = [];
    this.selectedRecruites = [];
    if (event !== undefined) {
      this.isRecruiters = true;
      this.selectedClient = _.findWhere(this.clients, { clientId: event });
      for (const recruiter of this.selectedClient.clientRecuriters) {
        this.recruitersArray.push({ user: recruiter, firstName: recruiter.name });
      }
    }
    this.deSelectAll();
  }

  onItemSelect(item: any) {
    if (item !== undefined && item !== '') {
      this.selectedRecruites.push({ email: item.user.email });
    }
  }

  onItemDeSelect(items: any) {
    const clear = this.selectedRecruites.indexOf(items);
    this.selectedRecruites.splice(clear, 1);
  }

  deSelectAll() {
    this.myForm.controls.recruitersName.setValue('');
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
      positionCount: parseInt(form.value.positionsCount, 0),
      status: form.value.status,
      enteredBy: this.rtsUserId,
      clientId: form.value.clientName,
      allocationUserId: form.value.allocation,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      jobDescription: form.value.jobDescription,
      teamId: form.value.team,
      note: form.value.notes,
      client: {
        clientId: form.value.clientName,
        clientRecuriters: this.selectedRecruites
      }
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
