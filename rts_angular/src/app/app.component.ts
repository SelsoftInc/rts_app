import { Component, DoCheck, OnDestroy } from '@angular/core';
import { LoggedUserService } from './Services/logged-user.service';
import { HideComponentService } from './Services/hide-component.service';
import { Router } from '@angular/router';
import { LoginService } from './login/login-service';
import { ToastrService } from 'ngx-toastr';
import { SubmissionsComponent } from './submissions/submissions.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { RecruiterDashboardComponent } from './dashboard/recruiter-dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { AccMgrDashboardComponent } from './dashboard/acc-mgr-dashboard/acc-mgr-dashboard.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { GraphExpansationComponent } from './graph-expansation/graph-expansation.component';
import { InterviewHistoryComponent } from './interview-history/interview-history.component';
import { CandidateReportComponent } from './candidate-report/candidate-report.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [LoggedUserService]
})
export class AppComponent implements DoCheck, OnDestroy {
  displayComponent: boolean;
  rtsUser: any;
  userRole: any;

  constructor(private loggedUser: LoggedUserService,
    private hideComponent: HideComponentService,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) {
    this.displayComponent = this.hideComponent.displayComponent;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
  }

  ngDoCheck() {
    this.displayComponent = this.hideComponent.displayComponent;
    this.rtsUser = JSON.parse(localStorage.getItem('rts_user'));
    if (this.rtsUser) {
      this.userRole = this.rtsUser.role;
    }
  }

  ngOnDestroy() {
    this.hideComponent.displayComponent = false;
  }

  onLogout() {
    SubmissionsComponent.filterBy = undefined;
    SubmissionsComponent.userDetails = undefined;
    SubmissionsComponent.recruiter = undefined;
    RequirementsComponent.userDetails = undefined;
    RequirementsComponent.filterBy = undefined;
    RecruiterDashboardComponent.graphData = undefined;
    AdminDashboardComponent.graphData = undefined;
    AccMgrDashboardComponent.graphData = undefined;
    GenerateReportComponent.userDetails = undefined;
    RequirementsComponent.recruiter = undefined;
    RequirementsComponent.status = undefined;
    RequirementsComponent.client = undefined;
    RequirementsComponent.team = undefined;
    RequirementsComponent.clientStatus = undefined;
    GraphExpansationComponent.graphExpandDeatils = undefined;
    InterviewHistoryComponent.userDetails = undefined;
    InterviewHistoryComponent.recruiter = undefined;
    InterviewHistoryComponent.client = undefined;
    InterviewHistoryComponent.team = undefined;
    InterviewHistoryComponent.filterBy = undefined;
    CandidateReportComponent.userDetails = undefined;
    CandidateReportComponent.client = undefined;
    this.loginService.logout();
    this.toastr.success('You are logged out', '', {
      positionClass: 'toast-top-center',
      timeOut: 3000,
    });
    return false;
  }
}
