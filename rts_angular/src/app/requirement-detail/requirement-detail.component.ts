import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { RequirementsService } from '../Services/requirements.service';
import { ActivatedRoute, Router, Params } from '../../../node_modules/@angular/router';
import { ToastrService } from '../../../node_modules/ngx-toastr';
import { UserService } from '../Services/user.service';
import { ClientService } from '../Services/client.service';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-requirement-detail',
  templateUrl: './requirement-detail.component.html',
  styleUrls: ['./requirement-detail.component.css'],
  providers: [LoggedUserService]
})
export class RequirementDetailComponent implements OnInit {

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
  selectedTeam: any;
  selectedTeamUsers: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private clientService: ClientService,
    private formBuilder: FormBuilder) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedTeamUsers = [];
    this.selectedRequirement = {};
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
      { 'name': 'In-Progress', 'value': 'IN-Progress' },
      { 'name': 'Closed', 'value': 'Closed' }
    ];
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      createdDate: ['', [Validators.required, Validators.minLength(3)]],
      positionName: ['', Validators.required],
      otherPositionName: [''],
      otherAccountName: [''],
      clientName: [''],
      accountName: [''],
      status: [''],
      bankName: ['', Validators.required],
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
      TBD: [''],
      FTE: [''],
      GC: [''],
      CITIZEN: [''],
      H1B: [''],
      W2_1099: [''],
      OPT_CPT: [''],
      EAD: [''],
      H4AD: [''],
    });
    this.getAllUsers();
    this.getAllClients();
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

  getAllRequirements() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirements = data.requirements;
            this.selectedRequirement = _.findWhere(this.requirements, { requirementId: this.requirementId });
            this.requirementCreatedDate = moment(this.selectedRequirement.createdOn).format('MMM D, Y');
            console.log(this.selectedRequirement);
            this.requirementByUser = this.selectedRequirement.requirementType;
            this.immigrationByUser = this.selectedRequirement.immigrationRequirement;
            this.selectedTeam = _.findWhere(this.teams, { teamId: this.selectedRequirement.teamId });
            this.selectedTeamUsers.push(this.selectedTeam.leadUser);
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
        });
  }

  getAllUsers() {
    const userId = {
      enteredBy: this.rtsUserId
    };

    console.log(userId);
    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.userDetails = data.users;
          }
        });

  }

  getAllClients() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.clientService.allClients(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.clients = data.clients;
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
    if (this.immigrationByUser.indexOf(data.value) === -1) {
      this.immigrationByUser.push(data.value);
    } else {
      this.immigrationByUser.splice(this.immigrationByUser.indexOf(data.value), 1);
    }
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

  updateRequirement(form: FormGroup) {

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
      technology: [{
        technologyId: form.value.technologies
      }],
      requirementId: this.requirementId
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

    this.editRequirement = requirement;

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
