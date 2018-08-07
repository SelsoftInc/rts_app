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
  editTeam: boolean;
  recruitersArray: any[];
  selectedRecruites: any[];
  isRecruiters: boolean;
  selectedClient: any;
  dropdownSettings: any;
  selectedrecruitersArray: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private clientService: ClientService,
    private formBuilder: FormBuilder
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedTeamUsers = [];
    this.selectedRecruites = [];
    this.selectedrecruitersArray = [];
    this.recruitersArray = [];
    this.selectedRequirement = {};
    this.dropdownSettings = {};
    this.requirementType = ['C2C', 'FTE', 'TBD'];
    this.immigration = [
      { 'id': 'GC', 'value': 'GC' },
      { 'id': 'CITIZEN', 'value': 'CITIZEN' },
      { 'id': 'H1B', 'value': 'H1B' },
      { 'id': 'W2_1099', 'value': 'W2/1099' },
      { 'id': 'OPT_CPT', 'value': 'OPT/CPT' },
      { 'id': 'EAD', 'value': 'EAD' },
      { 'id': 'H4AD', 'value': 'H4AD' },
    ];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'Open' },
      { 'name': 'In-Progress', 'value': 'In-Progress' },
      { 'name': 'Closed', 'value': 'Closed' }
    ];
  }

  ngOnInit() {

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
      C2C: [''],
      TBD: [''],
      FTE: [''],
      GC: [''],
      CITIZEN: [''],
      H1B: [''],
      W2_1099: [''],
      OPT_CPT: [''],
      EAD: [''],
      H4AD: [''],
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
            this.getAllRequirements();
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

  getAllRequirements() {

    const userId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            this.selectedRequirement = _.findWhere(this.requirements, { requirementId: this.requirementId });
            this.requirementCreatedDate = moment(this.selectedRequirement.createdOn).format('MMM D, Y');
            this.requirementByUser = this.selectedRequirement.requirementType;
            this.immigrationByUser = this.selectedRequirement.immigrationRequirement;
            this.selectedTeam = _.findWhere(this.teams, { teamId: this.selectedRequirement.teamId });
            this.selectedTeamUsers.push(this.selectedTeam.leadUser);
            this.isRecruiters = true;
            for (const recruiter of this.selectedRequirement.client.clientRecuriters) {
              this.recruitersArray.push({ user: recruiter, firstName: recruiter.name });
            }
            for (const value of this.selectedRequirement.clientRecuriters) {
              this.selectedRecruites.push({ email: value.email });
              this.selectedrecruitersArray.push({ user: value, firstName: value.name });
            }

            for (const user of this.selectedTeam.otherUsers) {
              this.selectedTeamUsers.push(user);
            }
            for (const value of this.requirementByUser) {
              if (value === 'C2C') {
                this.myForm.controls.C2C.setValue('C2C');
              } else if (value === 'FTE') {
                this.myForm.controls.FTE.setValue('FTE');
              } else if (value === 'TBD') {
                this.myForm.controls.TBD.setValue('TBD');
              }
            }
            for (const value of this.immigrationByUser) {
              if (value === 'GC') {
                this.myForm.controls.GC.setValue('GC');
              } else if (value === 'CITIZEN') {
                this.myForm.controls.CITIZEN.setValue('CITIZEN');
              } else if (value === 'H1B') {
                this.myForm.controls.H1B.setValue('H1B');
              } else if (value === 'W2/1099') {
                this.myForm.controls.W2_1099.setValue('W2/1099');
              } else if (value === 'OPT/CPT') {
                this.myForm.controls.OPT_CPT.setValue('OPT/CPT');
              } else if (value === 'EAD') {
                this.myForm.controls.EAD.setValue('EAD');
              } else if (value === 'H4AD') {
                this.myForm.controls.H4AD.setValue('H4AD');
              }
            }
          }
          console.log(this.selectedRequirement);
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
    if (this.immigrationByUser.indexOf(data.value) === -1) {
      this.immigrationByUser.push(data.value);
    } else {
      this.immigrationByUser.splice(this.immigrationByUser.indexOf(data.value), 1);
    }
    console.log(this.immigrationByUser);
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
      console.log(item);
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

  updateRequirement(form: FormGroup) {

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
      requirementId: this.requirementId,
      teamId: form.value.team,
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

    this.editRequirement = requirement;
    console.log(this.editRequirement);

    this.requirementService.updateRequirement(this.editRequirement)
      .subscribe(
        data => {
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
