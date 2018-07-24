import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RegisterService } from './user-register/user-register-service';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginService } from './login/login-service';
import { LoggedUserService } from './Services/logged-user.service';
import { RequirementsComponent } from './requirements/requirements.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { HideComponentService } from './Services/hide-component.service';
import { RequirementsService } from './Services/requirements.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, matSnackBarAnimations, MatCheckboxModule } from '@angular/material';
import { MatFormFieldModule, MatSlideToggleModule, MatIconModule } from '@angular/material';
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
import { RecruiterAddNewSubmissionsComponent } from './recruiter-add-new-submissions/recruiter-add-new-submissions.component';
import { SubmissionByRequirementComponent } from './submission-by-requirement/submission-by-requirement.component';
import { EditSubmissionsComponent } from './edit-submissions/edit-submissions.component';
import { ClientService } from './Services/client.service';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { RecruiterEditSubmissionsComponent } from './recruiter-edit-submissions/recruiter-edit-submissions.component';
import { CandidateService } from './Services/candidate.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserRegisterComponent,
    DashboardComponent,
    RequirementsComponent,
    SubmissionsComponent,
    AddNewRequirementComponent,
    EditRequirementComponent,
    AddNewSubmissionsComponent,
    ManageUsersComponent,
    AddUserComponent,
    RecruiterSubmissionsComponent,
    RecruiterAddNewSubmissionsComponent,
    SubmissionByRequirementComponent,
    EditSubmissionsComponent,
    ManageClientComponent,
    AddClientComponent,
    RecruiterEditSubmissionsComponent,
     ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MatIconModule
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
    ToastrService,
    DatePipe],

  bootstrap: [AppComponent]
})
export class AppModule { }