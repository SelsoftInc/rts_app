import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { appRoutes } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RegisterService } from './user-register/user-register-service';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from './login/login-service';
import { LoggedUserService } from './Services/logged-user.service';
import { RequirementsComponent } from './requirements/requirements.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { HideComponentService } from './Services/hide-component.service';
import { RequirementsService } from './Services/requirements.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, matSnackBarAnimations, MatCheckboxModule } from '@angular/material';
import { MatFormFieldModule, MatSlideToggleModule, MatIconModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material';
import { NativeDateModule } from '@angular/material';
import { AddNewRequirementComponent } from './add-new-requirement/add-new-requirement.component';
import { DatePipe } from '@angular/common';
import { EditRequirementComponent } from './edit-requirement/edit-requirement.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AddNewSubmissionsComponent } from './add-new-submissions/add-new-submissions.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { UserService } from './Services/user.service';
import { SubmissionService } from './Services/submission.service';
import { RecruiterSubmissionsComponent } from './recruiter-submissions/recruiter-submissions.component';
import { SubmissionByRequirementComponent } from './submission-by-requirement/submission-by-requirement.component';
import { ClientService } from './Services/client.service';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { RecruiterEditSubmissionsComponent } from './recruiter-edit-submissions/recruiter-edit-submissions.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';
import { CandidateService } from './Services/candidate.service';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { RequirementDetailComponent } from './requirement-detail/requirement-detail.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { TeamService } from './Services/team.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditRequirementForLeadUserComponent } from './edit-requirement-for-lead-user/edit-requirement-for-lead-user.component';
import { EditRequirementForAccMgrComponent } from './edit-requirement-for-acc-mgr/edit-requirement-for-acc-mgr.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { EditSubmissonComponent } from './edit-submisson/edit-submisson.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphService } from './Services/graph.service';
import { AccMgrDashboardComponent } from './dashboard/acc-mgr-dashboard/acc-mgr-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { RecruiterDashboardComponent } from './dashboard/recruiter-dashboard/recruiter-dashboard.component';
import { RouterModule } from '@angular/router';
import { UserSubmissionsComponent } from './user-submissions/user-submissions.component';
import { TeamSubmissionsComponent } from './team-submissions/team-submissions.component';
import { MatSortModule } from '@angular/material/sort';
import { ClientRequirementsComponent } from './client-requirements/client-requirements.component';
import { NgxEditorModule } from 'ngx-editor';
import { Ng4LoadingSpinnerModule } from 'ngx-loading-spinner';
import { NgProgressModule } from 'ngx-progressbar';
import { DeleteTeamComponent } from './delete-team/delete-team.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TeamSubmissionStatusComponent } from './team-submission-status/team-submission-status.component';
import { ClientSubmissionStatusComponent } from './client-submission-status/client-submission-status.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegisterComponent,
    RequirementsComponent,
    SubmissionsComponent,
    AddNewRequirementComponent,
    EditRequirementComponent,
    AddNewSubmissionsComponent,
    ManageUsersComponent,
    AddUserComponent,
    RecruiterSubmissionsComponent,
    SubmissionByRequirementComponent,
    ManageClientComponent,
    AddClientComponent,
    RecruiterEditSubmissionsComponent,
    ManageCandidateComponent,
    AddCandidateComponent,
    GenerateReportComponent,
    RequirementDetailComponent,
    EditUserComponent,
    EditClientComponent,
    EditCandidateComponent,
    ManageTeamComponent,
    AddTeamComponent,
    EditRequirementForLeadUserComponent,
    EditRequirementForAccMgrComponent,
    EditTeamComponent,
    EditSubmissonComponent,
    RecruiterDashboardComponent,
    AdminDashboardComponent,
    AccMgrDashboardComponent,
    UserSubmissionsComponent,
    TeamSubmissionsComponent,
    ClientRequirementsComponent,
    DeleteTeamComponent,
    TeamSubmissionStatusComponent,
    ClientSubmissionStatusComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    NativeDateModule,
    MatNativeDateModule,
    MatFormFieldModule,
    Ng2SearchPipeModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    MatIconModule,
    MatRadioModule,
    NgxChartsModule,
    MatSortModule,
    NgxEditorModule,
    Ng4LoadingSpinnerModule,
    NgProgressModule,
    NgxPaginationModule,
    PaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [
    RegisterService,
    LoginService,
    LoggedUserService,
    HideComponentService,
    RequirementsService,
    UserService,
    ClientService,
    CandidateService,
    SubmissionService,
    TeamService,
    ToastrService,
    GraphService,
    DatePipe],

  bootstrap: [AppComponent]
})
export class AppModule { }
