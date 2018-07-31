import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { AddNewRequirementComponent } from './add-new-requirement/add-new-requirement.component';
import { EditRequirementComponent } from './edit-requirement/edit-requirement.component';
import { AddNewSubmissionsComponent } from './add-new-submissions/add-new-submissions.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { RecruiterSubmissionsComponent } from './recruiter-submissions/recruiter-submissions.component';
import { RecruiterAddNewSubmissionsComponent } from './recruiter-add-new-submissions/recruiter-add-new-submissions.component';
import { SubmissionByRequirementComponent } from './submission-by-requirement/submission-by-requirement.component';
import { EditSubmissionsComponent } from './edit-submissions/edit-submissions.component';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { RecruiterEditSubmissionsComponent } from './recruiter-edit-submissions/recruiter-edit-submissions.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { RequirementDetailComponent } from './requirement-detail/requirement-detail.component';
import { EditUserComponent } from './edit-user/edit-user.component';



const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'requirements', component: RequirementsComponent },
  { path: 'submissions', component: SubmissionsComponent },
  { path: 'add-new-requirement', component: AddNewRequirementComponent },
  { path: 'edit-requirement/:id', component: EditRequirementComponent },
  { path: 'add-new-submission', component: AddNewSubmissionsComponent },
  { path: 'add-new-submission/:id', component: AddNewSubmissionsComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'recruiter-submissions', component: RecruiterSubmissionsComponent },
  { path: 'recruiter-add-new-submissions', component: RecruiterAddNewSubmissionsComponent },
  { path: 'submission-by-requirement/:id', component: SubmissionByRequirementComponent },
  { path: 'edit-submissions/:id', component: EditSubmissionsComponent },
  { path: 'manage-client', component: ManageClientComponent },
  { path: 'add-client', component: AddClientComponent },
  { path: 'recruiter-edit-submissions/:id', component: RecruiterEditSubmissionsComponent },
  { path: 'manage-candidate', component: ManageCandidateComponent },
  { path: 'add-candidate', component: AddCandidateComponent },
  { path: 'generate-report', component: GenerateReportComponent },
  { path: 'requirement-detail/:id', component: RequirementDetailComponent },
  { path: 'edit-user/:id', component: EditUserComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
