import { Component, DoCheck, OnDestroy, HostListener } from '@angular/core';
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
import { SearchCandidatesComponent } from './search-candidates/search-candidates.component';
import { TimeSheetService } from './Services/timeSheet.service';
import { ApiUrl } from 'src/app/Services/api-url';
import { browser } from 'protractor';

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
  rtsUserId: any;


  constructor(
    private loggedUser: LoggedUserService,
    private hideComponent: HideComponentService,
    private router: Router,
    private loginService: LoginService,
    private timeSheetService: TimeSheetService,
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
    const loginService = this.loginService;

    // window.addEventListener("beforeunload", function (e) {
    //   const token = localStorage.getItem('id_token');
    //   const userId = localStorage.getItem('user_id');
    //   var confirmationMessage = "\o/";
    //   (e || window.event).returnValue = confirmationMessage;
    //   // loginService.logout();
    //   // const user = {
    //   //   userId: userId,
    //   //   autoLogout: true
    //   // };
    //   // let headers = {
    //   //   type: 'application/json',
    //   //   Authorization:token
    //   // };
    //   // let blob = new Blob([JSON.stringify(user)], headers);
    //   // navigator.sendBeacon(ApiUrl.BaseUrl + ApiUrl.UserLogout, blob);

    //   return confirmationMessage;
    // });
    

  }


  ngOnDestroy() {
    this.hideComponent.displayComponent = false;
  }

  refresh() {
    const userId = {
      userId: this.rtsUser.userId,
      autoLogout: true
    };
    this.loginService.isLogout(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('You are logged out', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
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
    InterviewHistoryComponent.interviewStatus = undefined;
    SearchCandidatesComponent.skills = undefined;
    const userId = {
      userId: this.rtsUser.userId,
      autoLogout: false
    };

    this.loginService.isLogout(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('You are logged out', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
    this.router.navigate(['login']);
    return false;
  }
}
