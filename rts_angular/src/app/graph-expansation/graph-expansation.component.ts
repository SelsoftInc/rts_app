import { Component, OnInit, Inject } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../submissions/submissions.component';
import { NgProgress } from 'ngx-progressbar';
import { RequirementsService } from '../Services/requirements.service';
import * as moment from 'moment';
import * as _ from 'underscore';

@Component({
  selector: 'app-graph-expansation',
  templateUrl: './graph-expansation.component.html',
  styleUrls: ['./graph-expansation.component.css'],
  providers: [LoggedUserService]
})
export class GraphExpansationComponent implements OnInit {

  private rtsUserId: any;
  private rtsUser: any;
  chartData: DialogData;
  private currentDate: Date;
  private startDate: any;
  public static graphExpandDeatils: any;

  // options
  view: any[] = undefined;
  showDataLabel = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Status';
  showYAxisLabel = true;
  yAxisLabel = 'Submissions';

  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#f3a043', '#8796c0', '#7ed3ed', '#990A17', '#a95963']
  };
  requirements: any;
  selctedChartData: any[];
  teamUsers: any;
  selectedRequirements: any;
  recruiter: void;
  submissionsLength: any;

  constructor(
    public dialogRef: MatDialogRef<GraphExpansationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private router: Router,
    private ngProgress: NgProgress,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.requirements = [];
  }

  ngOnInit() {
    this.selctedChartData = this.data.chartData;
    this.startDate = this.data.fromDate;
    this.currentDate = this.data.toDate;
    this.recruiter = this.data.recruiter;
    this.getCommonDetails();
    this.getAllSubmissions();
  }


  filterByDate() {
    this.ngProgress.start();
    this.getAllSubmissions();
  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.teamUsers = data.myTeamUser;
          }
        });
  }

  getAllSubmissions() {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');

    const userId = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    this.requirementService.getAllSubmissionsByDate(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.requirements = data.requirements;
            for (const require of this.requirements) {
              require.filteredSubmissions = require.submissions;
            }
            this.selectedRequirements = this.requirements;
            this.getChartData(this.selectedRequirements);
            this.selectRecruiter(this.recruiter);
          }
        });
  }

  selectRecruiter(event) {
    this.recruiter = event;
    if (event === 'selectAll') {
      for (const require of this.requirements) {
        require.filteredSubmissions = require.submissions;
      }
      this.selectedRequirements = this.requirements;
      this.getChartData(this.selectedRequirements);
    } else {
      this.selectedRequirements = [];
      for (const require of this.requirements) {
        const selectedSubmissions = _.where(require.submissions, { enteredBy: event });
        if (selectedSubmissions.length !== 0) {
          require.filteredSubmissions = selectedSubmissions;
          this.selectedRequirements.push(require);
        }
      }
      this.getChartData(this.selectedRequirements);
    }
  }

  getChartData(data) {
    this.selctedChartData = [];
    this.submissionsLength = 0;
    for (const req of data) {
      this.submissionsLength = this.submissionsLength + req.filteredSubmissions.length;
    }
    const chartData = [];
    let APPROVED = 0, REJECTED = 0, IN_PROGRESS = 0, CLOSED = 0, SUBMITTED = 0, CLIENT_REJECTED = 0, SELECTED = 0, INTERVIEWED = 0, HOLD = 0, INTERVIEWED_REJECTED = 0;
    for (const req of data) {
      for (const sub of req.filteredSubmissions) {

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
        } else if (sub.status === 'INTERVIEWED_REJECTED') {
          INTERVIEWED_REJECTED++;
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

    let InterviewedRejectedObj = {
      name: 'INTERVIEWED_REJECTED',
      value: INTERVIEWED_REJECTED
    };

    chartData.push(SubmittedObj);
    chartData.push(ApprovedObj);
    chartData.push(InProgressObj);
    chartData.push(RejecedObj);
    chartData.push(HoldObj);
    chartData.push(InterviewObj);
    chartData.push(SelectedObj);
    chartData.push(ClosedObj);
    chartData.push(ClientRejectedObj);
    chartData.push(InterviewedRejectedObj);
    this.selctedChartData = chartData;
  }

  onUserSelect(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    GraphExpansationComponent.graphExpandDeatils = {
      recruiterId: this.recruiter,
      status: event.name,
      fromDate: fromDate,
      toDate: toDate,
      chartData: this.selctedChartData
    };
    this.router.navigate(['recruiter-submissions-status', this.recruiter, event.name, fromDate, toDate]);
    this.dialogRef.close();
  }

}
