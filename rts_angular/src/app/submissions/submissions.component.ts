import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
  providers: [LoggedUserService]
})
export class SubmissionsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private submissions: any;
  private submissionsLength: any;
  private requirements: any;
  private submissionDetails: any;
  private rtsCompanyId: any;
  private userRole: any;
  private currentDate: Date;
  public myForm: FormGroup;
  isStatus: boolean;
  isClient: boolean;
  isTeam: boolean;
  isRecruiter: boolean;
  filter: string;
  startDate: string;
  clients: any;
  teams: any;
  teamUsers: any;
  selectedRequirements: any;
  submissionStatus: any;
  toDate: any;


  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
    private formBuilder: FormBuilder,
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.rtsUserId = this.rtsUser.userId;
    this.selectedRequirements = [];
    this.submissionDetails = [];
    this.currentDate = new Date(Date.now());
    this.submissionStatus = [
      { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
      { 'name': 'Submitted', 'value': 'SUBMITTED' },
      { 'name': 'Approved', 'value': 'APPROVED' },
      { 'name': 'Rejected', 'value': 'REJECTED' },
      { 'name': 'TL Approved', 'value': 'TL_APPROVED' },
      { 'name': 'TL Rejeced', 'value': 'TL_REJECTED' },
      { 'name': 'Closed', 'value': 'CLOSED' }
    ];
    this.filter = '';
  }

  ngOnInit() {

    this.myForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });

    const currentDateMoment: moment.Moment = moment(this.currentDate);
    this.startDate = currentDateMoment.subtract(3, 'days').format('YYYY-MM-DD');

    this.getCommonDetails();
    if (this.userRole === 'ADMIN') {
      this.getAllSubmissions();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllSubmissionsForTeam();
    }
  }

  getAllSubmissions() {

    this.toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      companyId: this.rtsCompanyId,
      fromDate: this.startDate,
      toDate: this.toDate
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requimentsDetails(data);
          }
        });
  }

  getAllSubmissionsForTeam() {

    this.toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const teamId = {
      userId: this.rtsUserId,
      fromDate: this.startDate,
      toDate: this.toDate
    };

    this.requirementService.requirementsDetailsByTeam(teamId)
      .subscribe(
        data => {
          if (data.success) {
            this.requimentsDetails(data);
          }
        });
  }

  requimentsDetails(data) {
    this.submissionDetails = [];
    this.requirements = data.requirements;
    this.selectedRequirements = this.requirements;
    for (const require of this.selectedRequirements) {
      if (require.submissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    this.submissionsLength = this.submissionDetails.length;
  }

  selectedRequirementsDetails(data) {
    this.submissionDetails = [];
    this.selectedRequirements = data;
    for (const require of this.selectedRequirements) {
      if (require.submissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    this.submissionsLength = this.submissionDetails.length;
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
            this.teams = data.teams;
            this.teamUsers = data.myTeamUser;
          }
        });
  }

  filterBy(value) {

    if (value === 'status') {
      this.isStatus = true;
      this.isClient = false;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'team') {
      this.isTeam = true;
      this.isStatus = false;
      this.isClient = false;
      this.isRecruiter = false;
    } else if (value === 'client') {
      this.isClient = true;
      this.isStatus = false;
      this.isTeam = false;
      this.isRecruiter = false;
    } else if (value === 'recruiter') {
      this.isRecruiter = true;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
    } else if (value === '') {
      this.filter = '';
      this.isRecruiter = false;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
    }

    if (this.userRole === 'ADMIN') {
      this.getAllSubmissions();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllSubmissionsForTeam();
    }

  }

  filterByDate(form: FormGroup) {

    if (form.value.fromDate !== 'Invalid date' && form.value.fromDate !== '') {
      this.startDate = moment(form.value.fromDate).format('YYYY-MM-DD');
    } else {
      this.startDate = '';
    }

    this.filterBy('');
    if (this.userRole === 'ADMIN') {
      this.getAllSubmissions();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllSubmissionsForTeam();
    }
  }

  selectStatus(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      for (const require of this.requirements) {
        const selectedSubmissions = _.where(require.submissions, { status: event });
        if (selectedSubmissions.length !== 0) {
          require.submissions = selectedSubmissions;
          this.selectedRequirements.push(require);
        }
      }
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectTeam(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { teamId: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectClient(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { clientId: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  selectRecruiter(event) {
    if (event === 'selectAll') {
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      this.selectedRequirements = _.where(this.requirements, { allocationUserId: event });
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

}
