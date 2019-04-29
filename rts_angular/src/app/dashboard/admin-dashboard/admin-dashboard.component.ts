import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as moment from 'moment';
import { LoggedUserService } from '../../Services/logged-user.service';
import { GraphService } from '../../Services/graph.service';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { Sort } from '@angular/material';
import { GraphExpansationComponent } from '../../graph-expansation/graph-expansation.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  providers: [LoggedUserService]
})
export class AdminDashboardComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private recruitersSubmissions: any[];
  private multi: any[];
  private totalSubmissionByTeam: any[];
  private startDate: any;
  private currentDate: Date;
  private date: any;

  public static graphData: any;

  view: any[] = undefined;
  showDataLabel = true;
  show = true;

  clientWise: any[];
  teamComparison: any[];
  recruiterComparison: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Recruiters';
  showYAxisLabel = true;
  yAxisLabel = 'Submissions';
  yAxisClientLabel = 'Requirements';

  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed']
  };

  colorSchemePie = {
    domain: ['#b24348', '#f3a043', '#f8c644', '#d0d864', '#d05577', '#d14e46']
  };

  colorSchemeMultiBar1 = {
    domain: ['#5BB2A7', '#0FBED8', '#f3a043', '#990A17', '#22E4AC']
  };

  colorSchemeMultiBar2 = {
    domain: ['#5BB2A7', '#C4B7D0', '#990A17', '#E12926', '#E4DEEB']
  };

  colorSchemeMultiBar3 = {
    domain: ['#5BB2A7', '#a95963', '#990A17']
  };

  colorSchemeMultiBar4 = {
    domain: ['#5BB2A7', '#85C4BB', '#990A17', '#AFD5C6', '#E2EEE4']
  };

  colorSchemeMulti = {
    domain: ['#0386a4', '#A10A28', '#5AA454']
  };
  private totalSubmission: any;
  private teamDetails: any;
  private clientOpenRequitements: any;
  private interviewReport: any;
  private noSubmissionsRequirement: any;
  private noSubmissionsRequirementLength: any;
  private clientWiseSubmissionStatus: any;
  private interviewReportLength: any;
  sortedData: any;
  sortedRecruiterComparationData: any[];
  sortTeamData: any;
  sortTeamComparisonData: any;

  constructor(
    private loggedUser: LoggedUserService,
    private graphService: GraphService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.startDate = new Date(Date.now());
    this.currentDate = new Date(Date.now());
  }

  ngOnInit() {
    GraphExpansationComponent.graphExpandDeatils = undefined;
    this.ngProgress.start();
    this.getUserGraphDetails();
    this.getTeamGraphDetails();
    this.getClientRequirementsDetails();
    this.getInterviewReport();
    this.getNoSubmissionsRequirement();
    this.getClientSubmissionStatus();
    this.getRecruiterComparisonChart();
    this.getTeamComparisonChart();
  }

  dateFilter() {
    AdminDashboardComponent.graphData = undefined;
    this.ngProgress.start();
    this.getUserGraphDetails();
    this.getTeamGraphDetails();
    this.getClientRequirementsDetails();
    this.getInterviewReport();
    this.getClientSubmissionStatus();
    this.getRecruiterComparisonChart();
    this.getTeamComparisonChart();
  }

  getRecruiterComparisonChart() {
    this.recruiterComparison = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.recruiterComparsion(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.recruiterComparison = data.recruiterSubmissions;
            for (const recruiter of this.recruiterComparison) {
              for (const series of recruiter.series) {
                series.extra = {
                  userId: recruiter.userId
                };
              }
            }
            for (const recruiter of this.recruiterComparison) {
              const totalSubmission = recruiter.value;
              for (const series of recruiter.series) {
                if (series.name === 'Submitted' && series.value !== 0) {
                  const submissions = (series.value * 100) / totalSubmission;
                  recruiter.submittedPercentage = submissions;
                }
              }
            }
            this.sortedRecruiterComparationData = this.recruiterComparison.slice();
          }
        });
  }

  getTeamComparisonChart() {
    this.teamComparison = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.teamComparsion(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.teamComparison = data.teamSubmission;
            for (const team of this.teamComparison) {
              for (const series of team.series) {
                series.extra = {
                  teamId: team.teamId
                };
              }
            }
            this.sortTeamComparisonData = this.teamComparison.slice();
          }
        });
  }

  getClientSubmissionStatus() {
    this.clientWiseSubmissionStatus = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.clientSubmissionStatus(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.clientWiseSubmissionStatus = data.clientSubmissions;
            for (const client of this.clientWiseSubmissionStatus) {
              for (const series of client.series) {
                series.extra = {
                  clientId: client.clientId
                };
              }
            }
          }
        });
  }

  getNoSubmissionsRequirement() {

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.noSubmissionsRequirement(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.noSubmissionsRequirement = data.requirements;
            this.noSubmissionsRequirement.reverse();
            if (this.noSubmissionsRequirement === undefined) {
              this.noSubmissionsRequirement = [];
              this.noSubmissionsRequirementLength = 0;
            } else {
              this.noSubmissionsRequirementLength = this.noSubmissionsRequirement.length;
            }
          }
        });
  }

  getInterviewReport() {

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.getInterviewDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.interviewReport = data.submissionReport;
            this.interviewReportLength = this.interviewReport.length;
            this.sortedData = this.interviewReport.slice();
          }
        });
  }

  getUserGraphDetails() {
    this.recruitersSubmissions = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.userGraphDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.recruitersSubmissions = data.userSubmissions;
            for (const count of this.recruitersSubmissions) {
              count.extra = {
                userId: count.userId
              };
            }
          }
        });
  }

  getClientRequirementsDetails() {
    this.clientOpenRequitements = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.graphService.getClientOpenRequirements(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.clientOpenRequitements = data.clientRequirements;
            for (const count of this.clientOpenRequitements) {
              count.extra = {
                clientId: count.clientId
              };
            }
          }
        });
  }


  getTeamGraphDetails() {
    this.totalSubmissionByTeam = [];

    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    let graph = {
      userId: this.rtsUserId,
      fromDate: fromDate,
      toDate: toDate
    };

    if (AdminDashboardComponent.graphData === undefined) {
      AdminDashboardComponent.graphData = graph;
    } else {
      graph = AdminDashboardComponent.graphData;
      this.startDate = moment(graph.fromDate, 'YYYY-MM-DD').toDate();
      this.currentDate = moment(graph.toDate, 'YYYY-MM-DD').toDate();
    }

    this.totalSubmission = 0;

    this.graphService.teamGraphDetails(graph)
      .subscribe(
        data => {
          if (data.success) {
            this.totalSubmissionByTeam = data.teamSubmission;
            for (const count of this.totalSubmissionByTeam) {
              this.totalSubmission = this.totalSubmission + count.value;
              count.extra = {
                teamId: count.teamId
              };
            }
            for (const team of this.totalSubmissionByTeam) {
              for (const series of team.series) {
                series.extra = {
                  teamId: team.teamId
                };
              }
            }
            this.sortTeamData = this.totalSubmissionByTeam.slice();
          }
        });
  }

  onUserSelect(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['user-submisson', event.extra.userId, fromDate, toDate]);
  }

  onTeamSelect(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submisson', event.extra.teamId, fromDate, toDate]);
  }

  onClientSelect(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['client-requirements', event.extra.clientId, fromDate, toDate]);
  }

  onTeamSubmissionStatus(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-submissions-status', event.extra.teamId, event.name, fromDate, toDate]);
  }

  onClientSubmissionStatus(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['client-submissions-status', event.extra.clientId, event.name, fromDate, toDate]);
  }

  onRecruiterComparison(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['recruiter-comparison', event.extra.userId, event.name, fromDate, toDate]);
  }

  onTeamComparison(event) {
    const fromDate = moment(this.startDate).format('YYYY-MM-DD');
    const toDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.router.navigate(['team-comparison', event.extra.teamId, event.name, fromDate, toDate]);
  }

  sortData(sort: Sort) {
    const data = this.interviewReport.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'positionName': return this.compare(a.positionName, b.positionName, isAsc);
        case 'candidateName': return this.compare(a.candidateName, b.candidateName, isAsc);
        case 'clientName': return this.compare(a.clientName, b.clientName, isAsc);
        case 'InterviewDateTime': return this.compare(a.interviewDateStr, b.interviewDateStr, isAsc);
        case 'InterviewLevel': return this.compare(a.interviewLevel, b.interviewLevel, isAsc);
        case 'recruiterName': return this.compare(a.recruiterName, b.recruiterName, isAsc);
        case 'skype': return this.compare(a.skypeId, b.skypeId, isAsc);
        case 'phoneNumber': return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
        default: return 0;
      }
    });
  }

  sortRecruiterComparation(sort: Sort) {
    const data = this.recruiterComparison.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedRecruiterComparationData = data;
      return;
    }

    this.sortedRecruiterComparationData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'recruiterName': return this.compare(a.name, b.name, isAsc);
        case 'submitted': return this.compare(a.value, b.value, isAsc);
        case 'submittedPercentage': return this.compare(a.submittedPercentage, b.submittedPercentage, isAsc);
        default: return 0;
      }
    });
  }

  sortTeam(sort: Sort) {
    const data = this.sortTeamData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortTeamData = data;
      return;
    }

    this.sortTeamData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // case 'recruiterName': return this.compare(a.name, b.name, isAsc);
        // case 'submitted': return this.compare(a.value, b.value, isAsc);
        case 'total': return this.compare(a.value, b.value, isAsc);
        default: return 0;
      }
    });
  }

  sortTeamComparison(sort: Sort) {
    const data = this.sortTeamComparisonData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortTeamComparisonData = data;
      return;
    }

    this.sortTeamComparisonData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // case 'recruiterName': return this.compare(a.name, b.name, isAsc);
        // case 'submitted': return this.compare(a.value, b.value, isAsc);
        case 'total': return this.compare(a.value, b.value, isAsc);
        default: return 0;
      }
    });
  }


  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
