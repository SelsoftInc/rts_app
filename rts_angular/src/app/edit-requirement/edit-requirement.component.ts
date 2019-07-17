import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../Services/requirements.service';
import { LoggedUserService } from '../Services/logged-user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { UserService } from '../Services/user.service';
import { ClientService } from '../Services/client.service';
import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';
import { DeleteRequirementComponent } from '../delete-requirement/delete-requirement.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-edit-requirement',
  templateUrl: './edit-requirement.component.html',
  styleUrls: ['./edit-requirement.component.css'],
  providers: [LoggedUserService]
})
export class EditRequirementComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private requirementId: any;
  private requirements: any;
  private selectedRequirement: any;
  private requirementCreatedDate: any;
  private userDetails: any;
  private rtsCompanyId: any;
  private clients: any;

  public myForm: FormGroup;
  private requirementType: any;
  private immigration: any;
  private requirementByUser: any;
  private immigrationByUser: any;
  private isOtherPositionName: boolean;
  private isOtherAccountName: boolean;
  private technologies: any;
  private accounts: any;
  private positions: any;
  private teams: any;
  private requirementStatus: any;
  private editRequirement: any;
  private isOtherTechnology: boolean;
  private selectedTeam: any;
  private selectedTeamUsers: any;
  private userRole: any;
  private editTeam: boolean;
  private recruitersArray: any[];
  private selectedRecruites: any[];
  private isRecruiters: boolean;
  private selectedClient: any;
  private dropdownSettings: any;
  private selectedrecruitersArray: any;
  private accountName: any;
  private selctedVisaStatus: any;
  private isOtherImmigration: boolean;
  private dropdownSettingsForAllocationUsers: any;
  private multiSelectUsers: any[];
  private selectedAllocationUsers: any;
  teamName: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedTeamUsers = [];
    this.selectedRecruites = [];
    this.multiSelectUsers = [];
    this.selectedrecruitersArray = [];
    this.selectedAllocationUsers = [];
    this.selctedVisaStatus = [];
    this.recruitersArray = [];
    this.selectedRequirement = {};
    this.dropdownSettings = {};
    this.requirementType = ['C2C', 'C2H', 'FTE', 'TBD'];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'Open' },
      { 'name': 'In-Progress', 'value': 'In-Progress' },
      { 'name': 'Closed', 'value': 'Closed' }
    ];
  }

  ngOnInit() {
    this.ngProgress.start();

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      createdDate: [''],
      positionName: [''],
      otherPositionName: [''],
      otherAccountName: [''],
      clientName: [''],
      accountName: [''],
      status: [''],
      bankName: [''],
      priority: [''],
      location: [''],
      positionsCount: [''],
      technologies: [''],
      allocation: [''],
      clientRate: [''],
      sellingRate: [''],
      jobDescription: [''],
      team: [''],
      comments: [''],
      notes: [''],
      C2C: [''],
      C2H: [''],
      TBD: [''],
      FTE: [''],
      immigrationStatus: [''],
      otherTechnology: [''],
      recruitersName: [''],
      otherImmigration: ['']
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
    this.dropdownSettingsForAllocationUsers = {
      singleSelection: false,
      idField: 'userId',
      textField: 'firstName',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getCommonDetails();
  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
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
            this.immigration = data.visaStatus;
            for (const immigration of this.immigration) {
              immigration.isChecked = false;
            }
            this.getAllRequirements();
          }
        });
  }


  getAllRequirements() {

    const userId = {
      requirementId: this.requirementId
    };

    this.requirementService.getRequirementsById(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.multiSelectUsers = [];
            this.selectedAllocationUsers = [];
            this.ngProgress.done();
            this.selectedRequirement = data.requirement;
            this.requirementCreatedDate = moment(this.selectedRequirement.createdOn).format('MMM D, Y');
            this.requirementByUser = this.selectedRequirement.requirementTypes;
            this.selctedVisaStatus = this.selectedRequirement.visaStatus;
            if (this.selectedRequirement.team !== undefined) {
              this.selectedTeam = _.findWhere(this.teams, { teamId: this.selectedRequirement.team.teamId });             
              for (const user of this.selectedTeam.leadUsers) {
                this.selectedTeamUsers.push(user);
              }
              for (const user of this.selectedTeam.otherUsers) {
                this.selectedTeamUsers.push(user);
              }
            }
            this.isRecruiters = true;
            this.accountName = this.selectedRequirement.account.accountId;
            this.teamName = this.selectedRequirement.team.teamId
            for (const client of this.clients) {
              if (client.clientId == this.selectedRequirement.client.clientId) {
                this.selectedClient = client;
              }
            }
            for (const recruiter of this.selectedClient.clientRecruiters) {
              this.recruitersArray.push({ user: recruiter.clientRecruiterId, firstName: recruiter.name });
            }
            for (const value of this.selectedRequirement.toClientRecruiters) {
              this.selectedrecruitersArray.push({ user: value.clientRecruiterId, firstName: value.name });
            }

            for (const value of this.requirementByUser) {
              if (value === 'C2C') {
                this.myForm.controls.C2C.setValue('C2C');
              } else if (value === 'C2H') {
                this.myForm.controls.C2H.setValue('C2H');
              } else if (value === 'FTE') {
                this.myForm.controls.FTE.setValue('FTE');
              } else if (value === 'TBD') {
                this.myForm.controls.TBD.setValue('TBD');
              }
            }
            for (const visa of this.selctedVisaStatus) {
              for (const immigration of this.immigration) {
                if (_.isEqual(visa.visaStatusId, immigration.visaStatusId)) {
                  immigration.isChecked = true;
                }
              }
            }
            for (const ids of this.selctedVisaStatus) {
              this.immigrationByUser.push(ids.visaStatusId);
            }

            for (const user of this.selectedTeamUsers) {
              this.multiSelectUsers.push({ userId: user.userId, firstName: user.firstName + ' ' + user.lastName });
            }
            for (const user of this.selectedRequirement.allocationUsers) {
              this.selectedAllocationUsers.push({ userId: user.userId, firstName: user.firstName + ' ' + user.lastName });
            }
          }
        });
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

  getOtherImmigration(data) {
    if (data.checked) {
      this.isOtherImmigration = true;
    } else {
      this.isOtherImmigration = false;
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
      this.selectedTeamUsers = [];
      this.multiSelectUsers = [];
      this.selectedTeam = _.findWhere(this.teams, { teamId: parseInt(event) });     
      for (const user of this.selectedTeam.leadUsers) {
        this.selectedTeamUsers.push(user);
      }
      for (const user of this.selectedTeam.otherUsers) {
        this.selectedTeamUsers.push(user);
      }
      for (const user of this.selectedTeamUsers) {
        this.multiSelectUsers.push({ userId: user.userId, firstName: user.firstName + ' ' + user.lastName });
      }
    }
    this.deSelectAllAllocationUsers();
  }

  deSelectAllAllocationUsers() {
    this.myForm.controls.allocation.setValue([]);
  }

  getClientRecruiters(event) {
    this.recruitersArray = [];
    this.selectedRecruites = [];
    if (event !== undefined) {
      this.isRecruiters = true;
      this.selectedClient = _.findWhere(this.clients, { clientId: parseInt(event) });
      for (const recruiter of this.selectedClient.clientRecruiters) {
        this.recruitersArray.push({ user: recruiter.clientRecruiterId, firstName: recruiter.name });
      }
    }
    this.deSelectAll();
  }

  deSelectAll() {
    this.myForm.controls.recruitersName.setValue('');
  }

  deleteRequirement(id) {
    const dialogRef = this.dialog.open(DeleteRequirementComponent, {
      width: '500px',
      data: { requirementId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result);
      // this.router.navigate(['requirements']);
    });

  }

  updateRequirement(form: FormGroup) {

    this.ngProgress.start();
    const selectedRecruitersId = [];
    for (const clientRecruiters of this.selectedrecruitersArray) {
      selectedRecruitersId.push({ clientRecruiterId: clientRecruiters.user });
    }

    const selectedImmigration = [];
    for (const label of this.immigrationByUser) {
      selectedImmigration.push({ visaStatusId: label });
    }
    if (this.isOtherImmigration) {
      selectedImmigration.push({ visaName: form.value.otherImmigration });
    }

    const requirement: any = {
      priority: form.value.priority,
      location: form.value.location,
      requirementTypes: this.requirementByUser,
      visaStatus: selectedImmigration,
      positionCount: parseInt(form.value.positionsCount, 0),
      status: form.value.status,
      enteredBy: this.rtsUserId,
      clientId: parseInt(form.value.clientName),
      allocationUsers: this.selectedAllocationUsers,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      jobDescription: form.value.jobDescription,
      requirementId: parseInt(this.requirementId),
      teamId: parseInt(form.value.team),
      note: form.value.notes,
      toClientRecruiters: selectedRecruitersId
    };

    if (form.value.positionName === 'other') {
      requirement.position = {
        positionName: form.value.otherPositionName
      };
    } else {
      requirement.positionId = parseInt(form.value.positionName);
    }

    if (form.value.accountName === 'other') {
      requirement.account = {
        accountName: form.value.otherAccountName
      };
    } else {
      requirement.accountId = parseInt(form.value.accountName);
    }

    if (form.value.technologies === 'other') {
      requirement.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      requirement.technology = [{
        technologyId: parseInt(form.value.technologies)
      }];
    }

    this.editRequirement = requirement;

    this.requirementService.updateRequirement(this.editRequirement)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
            this.toastr.success('Requirement Update successfully', '', {
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
