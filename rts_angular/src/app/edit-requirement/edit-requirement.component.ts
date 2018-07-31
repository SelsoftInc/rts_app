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
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedRequirement = {};
    this.requirementType = ['C2C', 'FTE', 'TBD'];
    this.immigration = ['GC', 'CITIZEN', 'H1B'];
    this.requirementStatus = [
      { 'name': 'Open', 'value': 'open' },
      { 'name': 'In-Progress', 'value': 'inprogress' },
      { 'name': 'Closed', 'value': 'closed' }
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
      C2C: [''],
      TBD: [''],
      FTE: [''],
      GC: [''],
      CITIZEN: [''],
      H1B: [''],
      otherTechnology: ['']
    });
    this.getAllRequirements();
    this.getAllUsers();
    this.getAllClients();
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
            console.log(this.selectedRequirement);
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
              }
            }

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
