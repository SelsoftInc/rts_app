import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
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
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { EditRequirementForLeadUserComponent } from './edit-requirement-for-lead-user/edit-requirement-for-lead-user.component';
import { EditRequirementForAccMgrComponent } from './edit-requirement-for-acc-mgr/edit-requirement-for-acc-mgr.component';
import { AccMgrEditSubmissionsComponent } from './acc-mgr-edit-submissions/acc-mgr-edit-submissions.component';
import { LeadUserEditSubmissionsComponent } from './lead-user-edit-submissions/lead-user-edit-submissions.component';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { EditSubmissonComponent } from './edit-submisson/edit-submisson.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { UserSubmissionsComponent } from './user-submissions/user-submissions.component';
import { TeamSubmissionsComponent } from './team-submissions/team-submissions.component';


export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'requirements', component: RequirementsComponent },
  { path: 'submissions', component: SubmissionsComponent },
  { path: 'add-new-requirement', component: AddNewRequirementComponent },
  { path: 'edit-requirement/:id', component: EditRequirementComponent },
  { path: 'add-new-submission', component: AddNewSubmissionsComponent },
  { path: 'add-new-submission/:id', component: AddNewSubmissionsComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'recruiter-submissions', component: RecruiterSubmissionsComponent },
  // { path: 'recruiter-add-new-submissions', component: RecruiterAddNewSubmissionsComponent },
  // { path: 'recruiter-add-new-submissions/:id', component: RecruiterAddNewSubmissionsComponent },
  { path: 'submission-by-requirement/:id', component: SubmissionByRequirementComponent },
  { path: 'edit-submissions/:id', component: EditSubmissionsComponent },
  { path: 'acc_mgr-edit-submissions/:id', component: AccMgrEditSubmissionsComponent },
  { path: 'leadUser-edit-submissions/:id', component: LeadUserEditSubmissionsComponent },
  { path: 'manage-client', component: ManageClientComponent },
  { path: 'add-client', component: AddClientComponent },
  { path: 'recruiter-edit-submissions/:id', component: RecruiterEditSubmissionsComponent },
  { path: 'manage-candidate', component: ManageCandidateComponent },
  { path: 'add-candidate', component: AddCandidateComponent },
  { path: 'generate-report', component: GenerateReportComponent },
  { path: 'requirement-detail/:id', component: RequirementDetailComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'edit-client/:id', component: EditClientComponent },
  { path: 'edit-candidate/:id', component: EditCandidateComponent },
  { path: 'manage-team', component: ManageTeamComponent },
  { path: 'add-team', component: AddTeamComponent },
  { path: 'edit-team/:id', component: EditTeamComponent },
  { path: 'leadUser-edit-requirement/:id', component: EditRequirementForLeadUserComponent },
  { path: 'acc_mgr-edit-requirement/:id', component: EditRequirementForAccMgrComponent },
  { path: 'edit-submission/:id', component: EditSubmissonComponent },
  { path: 'user-submisson/:id/:date', component: UserSubmissionsComponent },
  { path: 'team-submisson/:id/:date', component: TeamSubmissionsComponent },
];


// @NgModule({
//   imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
