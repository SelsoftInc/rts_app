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
import { MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, matSnackBarAnimations, MatCheckboxModule, MatAutocomplete, MatOption, MatAutocompleteModule, MatOptionModule, MatSelect, MatSelectModule } from '@angular/material';
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
import { RecruiterComparisonComponent } from './recruiter-comparison/recruiter-comparison.component';
import { TeamComparisonComponent } from './team-comparison/team-comparison.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecruiterSubmissionsStatusComponent } from './recruiter-submissions-status/recruiter-submissions-status.component';
import { GraphExpansationComponent } from './graph-expansation/graph-expansation.component';
import { InterviewHistoryComponent } from './interview-history/interview-history.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { CandidateReportComponent } from './candidate-report/candidate-report.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { SnackbarComponentComponent } from './snackbar-component/snackbar-component.component';
import { InProgressInterviewsComponent } from './in-progress-interviews/in-progress-interviews.component';
import { JoiningDateComponent } from './joining-date/joining-date.component';
import { SelectedSubmissionComponent } from './selected-submission/selected-submission.component';
import { SearchCandidatesComponent } from './search-candidates/search-candidates.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SendMailComponent } from './send-mail/send-mail.component';
import { DeleteRequirementComponent } from './delete-requirement/delete-requirement.component';
import { DeleteSubmissionComponent } from './delete-submission/delete-submission.component';
import { SearchCandidateEmailComponent } from './search-candidate-email/search-candidate-email.component';
import { ClipboardModule } from 'ngx-clipboard';
import { VendorMailComponent } from './vendor-mail/vendor-mail.component';
import { VendorService } from './Services/vendor.service';
import { AutoRefreshComponent } from './auto-refresh/auto-refresh.component';
import { TimeSheetService } from './Services/timeSheet.service';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { TimeSheetDetailsComponent } from './time-sheet-details/time-sheet-details.component';
import { TimesheetReportComponent } from './timesheet-report/timesheet-report.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { SatDatepickerModule, SatNativeDateModule } from 'node_modules/saturn-datepicker';
import { CreateHolidayComponent } from './create-holiday/create-holiday.component';
import { HolidayListComponent } from './holiday-list/holiday-list.component';

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
    RecruiterComparisonComponent,
    TeamComparisonComponent,
    ForgotPasswordComponent,
    RecruiterSubmissionsStatusComponent,
    GraphExpansationComponent,
    InterviewHistoryComponent,
    DeleteUserComponent,
    CandidateReportComponent,
    SnackbarComponentComponent,
    InProgressInterviewsComponent,
    JoiningDateComponent,
    SelectedSubmissionComponent,
    SearchCandidatesComponent,
    SendMailComponent,
    DeleteRequirementComponent,
    DeleteSubmissionComponent,
    SearchCandidateEmailComponent,
    VendorMailComponent,
    AutoRefreshComponent,
    TimeSheetComponent,
    TimeSheetDetailsComponent,
    TimesheetReportComponent,
    LeaveRequestComponent,
    CreateHolidayComponent,
    HolidayListComponent,
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
    MatAutocompleteModule, MatOptionModule,
    MatCheckboxModule,
    NativeDateModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatFormFieldModule,
    Ng2SearchPipeModule, NgSelectModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    MatIconModule,
    MatRadioModule,
    NgxChartsModule,
    MatSortModule,
    ClipboardModule,
    NgxEditorModule,
    Ng4LoadingSpinnerModule,
    NgProgressModule,
    NgxPaginationModule,
    PaginationModule,
    OwlDateTimeModule,
    MatSelectModule,
    MatOptionModule,
    OwlNativeDateTimeModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
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
    VendorService,
    MessagingService,
    TimeSheetService,
    AsyncPipe,
    DatePipe],

  entryComponents: [
    SnackbarComponentComponent,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
