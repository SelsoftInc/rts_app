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
import { NgProgress } from 'ngx-progressbar';

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

  public myForm: FormGroup;
  private requirementType: any;
  private requirementByUser: any;
  private immigrationByUser: any;
  private teams: any;
  private requirementStatus: any;
  private editRequirement: any;
  private selectedTeam: any;
  private selectedTeamUsers: any;
  selectedImmigration: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.requirementByUser = [];
    this.immigrationByUser = [];
    this.selectedTeamUsers = [];
    this.selectedRequirement = {};
  }

  ngOnInit() {
    this.ngProgress.start();
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
      requirementType: [''],
      immigrationType: [''],
    });
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
            this.teams = data.teams;
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
            this.ngProgress.done();
            this.selectedRequirement = data.requirement;
            this.requirementCreatedDate = moment(this.selectedRequirement.createdOn).format('MMM D, Y');
            this.requirementByUser = this.selectedRequirement.requirementType;
            for (const immigration of this.selectedRequirement.visaStatus) {
              this.immigrationByUser.push(immigration.visaName);
            }
            this.selectedTeam = _.findWhere(this.teams, { teamId: this.selectedRequirement.teamId });
            if (this.selectedTeam.leadUser !== undefined) {
              this.selectedTeamUsers.push(this.selectedTeam.leadUser);
            }
            for (const user of this.selectedTeam.otherUsers) {
              this.selectedTeamUsers.push(user);
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

}

