import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
  providers: [LoggedUserService]
})
export class SubmissionsComponent implements OnInit {

  // options
  view: any[] = undefined;
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Recruiters';
  showYAxisLabel = false;
  yAxisLabel = 'Submissions';
  yAxisClientLabel = 'Requirements';
  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed']
  };
  searchBox: boolean;

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
  private isStatus: boolean;
  private isClient: boolean;
  private isTeam: boolean;
  private isRecruiter: boolean;
  private filter: string;
  private startDate: any;
  private clients: any;
  private teams: any;
  private teamUsers: any;
  private selectedRequirements: any;
  private submissionStatus: any;
  private filteredRequirements: any;
  private chartData: any[];
  recruiter: any;

  public static userDetails: any;
  public static filterBy: any;
  public static recruiter: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private hideComponent: HideComponentService,
    private formBuilder: FormBuilder,
    private ngProgress: NgProgress,
    private router: Router
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
      { 'name': 'Closed', 'value': 'CLOSED' },
      { 'name': 'Client Rejeced', 'value': 'CLIENT_REJECTED' },
      { 'name': 'Candidate Selected', 'value': 'SELECTED' },
      { 'name': 'Interview', 'value': 'INTERVIEWED' },
      { 'name': 'Hold', 'value': 'HOLD' }
    ];
    this.filter = '';
    this.recruiter = '';
    this.searchBox = true;
  }

  ngOnInit() {
    this.ngProgress.start();

    this.myForm = this.formBuilder.group({
      fromDate: [''],
      toDate: ['']
    });

    this.startDate = this.currentDate;
    this.getCommonDetails();
    this.getAllSubmissions();
  }


  getAllSubmissions() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    let userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (SubmissionsComponent.userDetails === undefined) {
      SubmissionsComponent.userDetails = userId;
    } else {
      userId = SubmissionsComponent.userDetails;
      this.startDate = userId.fromDate;
      this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();
    }

    this.requirementService.getAllSubmissionsByDate(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requimentsDetails(data);
          }
        });
  }


  requimentsDetails(data) {
    this.ngProgress.done();
    this.submissionsLength = 0;
    this.submissionDetails = [];
    this.requirements = data.requirements;
    this.filteredRequirements = this.requirements;
    this.selectedRequirements = this.requirements;
    for (const require of this.selectedRequirements) {
      if (require.submissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    for (const count of this.submissionDetails) {
      this.submissionsLength = this.submissionsLength + count.submissions.length;
    }
    if (SubmissionsComponent.filterBy !== undefined) {
      this.filter = SubmissionsComponent.filterBy;
      this.filterBy(SubmissionsComponent.filterBy);
      if (SubmissionsComponent.filterBy === 'recruiter') {
        this.selectRecruiter(SubmissionsComponent.recruiter);
      }
    }
  }

  selectedRequirementsDetails(data) {
    this.submissionsLength = 0;
    this.submissionDetails = [];
    this.selectedRequirements = data;
    this.filteredRequirements = this.selectedRequirements;
    for (const require of this.selectedRequirements) {
      if (require.submissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    for (const count of this.submissionDetails) {
      this.submissionsLength = this.submissionsLength + count.submissions.length;
    }
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

    SubmissionsComponent.filterBy = value;

    if (value === 'status') {
      this.isStatus = true;
      this.isClient = false;
      this.isTeam = false;
      this.isRecruiter = false;
      this.searchBox = true;
    } else if (value === 'team') {
      this.isTeam = true;
      this.isStatus = false;
      this.isClient = false;
      this.isRecruiter = false;
      this.searchBox = true;
    } else if (value === 'client') {
      this.isClient = true;
      this.isStatus = false;
      this.isTeam = false;
      this.isRecruiter = false;
      this.searchBox = true;
    } else if (value === 'recruiter') {
      this.isRecruiter = true;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
      this.searchBox = true;
    } else if (value === '') {
      this.filter = '';
      this.isRecruiter = false;
      this.isTeam = false;
      this.isStatus = false;
      this.isClient = false;
      this.searchBox = true;
    }
    this.recruiter = '';
    this.selectedRequirementsDetails(this.requirements);
  }

  filterItem(value) {
    this.submissionsLength = 0;
    this.submissionDetails = [];
    const filteredItems = Object.assign([], this.filteredRequirements).filter(
      item => item.position.positionName.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.selectedRequirements = filteredItems;
    for (const require of this.selectedRequirements) {
      if (require.submissions.length > 0) {
        this.submissionDetails.push(require);
      }
    }
    for (const count of this.submissionDetails) {
      this.submissionsLength = this.submissionsLength + count.submissions.length;
    }
  }

  filterByDate() {
    SubmissionsComponent.userDetails = undefined;
    SubmissionsComponent.recruiter = undefined;
    // SubmissionsComponent.filterBy = undefined;
    this.recruiter = '';
    this.ngProgress.start();
    this.filterBy('');
    this.getAllSubmissions();
  }

  selectStatus(event) {
    this.searchBox = true;
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
    SubmissionsComponent.recruiter = event;
    this.recruiter = event;
    if (event === 'selectAll') {
      this.chartData = [];
      this.searchBox = true;
      this.selectedRequirements = this.requirements;
      this.selectedRequirementsDetails(this.selectedRequirements);
    } else {
      this.searchBox = false;
      this.selectedRequirements = [];
      for (const require of this.requirements) {
        const selectedSubmissions = _.where(require.submissions, { enteredBy: event });
        if (selectedSubmissions.length !== 0) {
          require.submissions = selectedSubmissions;
          this.selectedRequirements.push(require);
        }
      }

      this.chartData = [];
      let APPROVED = 0, REJECTED = 0, IN_PROGRESS = 0, CLOSED = 0, SUBMITTED = 0, CLIENT_REJECTED = 0, SELECTED = 0, INTERVIEWED = 0, HOLD = 0;
      for (const req of this.selectedRequirements) {
        for (const sub of req.submissions) {

          if (sub.status === 'APPROVED' || sub.status === 'TL_APPROVED') {
            APPROVED++;
          } else if (sub.status === 'REJECTED' || sub.status === 'TL_REJECTED') {
            REJECTED++;
          } else if (sub.status === 'IN-PROGRESS') {
            IN_PROGRESS++;
          } else if (sub.status === 'CLOSED') {
            CLOSED++;
          } else if (sub.status === 'SUBMITTED') {
            SUBMITTED++;
          } else if (sub.status === 'CLIENT_REJECTED') {
            CLIENT_REJECTED++;
          } else if (sub.status === 'SELECTED') {
            SELECTED++;
          } else if (sub.status === 'INTERVIEWED') {
            INTERVIEWED++;
          } else if (sub.status === 'HOLD') {
            HOLD++;
          }
        }
      }

      let ApprovedObj = {
        name: 'APPROVED',
        value: APPROVED
      };

      let RejecedObj = {
        name: 'REJECTED',
        value: REJECTED
      };

      let InProgressObj = {
        name: 'IN-PROGRESS',
        value: IN_PROGRESS
      };

      let ClosedObj = {
        name: 'CLOSED',
        value: CLOSED
      };

      let SubmittedObj = {
        name: 'SUBMITTED',
        value: SUBMITTED
      };

      let ClientRejectedObj = {
        name: 'CLIENT_REJECTED',
        value: CLIENT_REJECTED
      };

      let SelectedObj = {
        name: 'SELECTED',
        value: SELECTED
      };

      let InterviewObj = {
        name: 'INTERVIEWED',
        value: INTERVIEWED
      };

      let HoldObj = {
        name: 'HOLD',
        value: HOLD
      };

      this.chartData.push(SubmittedObj);
      this.chartData.push(ApprovedObj);
      this.chartData.push(InProgressObj);
      this.chartData.push(RejecedObj);
      this.chartData.push(HoldObj);
      this.chartData.push(InterviewObj);
      this.chartData.push(ClosedObj);
      this.chartData.push(ClientRejectedObj);
      for (const user of this.chartData) {
        user.extra = { userId: event };
      }
      this.selectedRequirementsDetails(this.selectedRequirements);
    }
  }

  onUserSelect(event) {
    // const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    // const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    // this.router.navigate(['recruiter-submissions-status', event.extra.userId, event.name, fromDate, toDate]);
  }
}
