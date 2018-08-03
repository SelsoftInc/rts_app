import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { ToastrService } from 'ngx-toastr';
import { SubmissionService } from '../Services/submission.service';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { CandidateService } from '../Services/candidate.service';

@Component({
  selector: 'app-recruiter-add-new-submissions',
  templateUrl: './recruiter-add-new-submissions.component.html',
  styleUrls: ['./recruiter-add-new-submissions.component.css'],
  providers: [LoggedUserService]
})
export class RecruiterAddNewSubmissionsComponent implements OnInit {

  public myForm: FormGroup;
  rtsUser: any;
  rtsUserId: any;
  requirementsDetails: any;
  files: any;
  getFiles: any;
  rtsCompanyId: any;
  status: any;
  private selectRequiement: any;
  selectedCandidate: any;
  isCandidate: boolean;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private submissionService: SubmissionService,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.status = [
      { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
    ];
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      requirements: ['', Validators.required],
      candidateEmail: [''],
      candidatePhone: [''],
      clientContactname: [''],
      clientContactEmail: [''],
      candidateName: [''],
      accountName: [''],
      clientRate: [''],
      sellingRate: [''],
      status: [''],
      availability: [''],
      technology: [''],
      workLocation: [''],
      candidateImmigirationStatus: [''],
      candidateLocation: [''],
      skype: [''],
      linkedIn: [''],
      c2c: [''],
    });
    this.getAllRequirementsForUser();
  }

  getAllRequirementsForUser() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsForUser(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails = data.requirements;
          }
        });
  }

  getRequirement(event) {
    this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: event });
  }

  getCandidateDetails() {
    const candidate = {
      email: this.myForm.controls.candidateEmail.value,
      companyId: this.rtsCompanyId
    };

    this.candidateService.getCandidate(candidate)
      .subscribe(
        data => {
          if (data.success) {
            this.selectedCandidate = data.candidate;
            this.isCandidate = true;
          } else {
            this.isCandidate = false;
          }
        });
  }

  fileChangeEvent(event: any) {
    this.files = event.target.files;
    for (const file of this.files) {
      this.getFiles.push(file);
    }
  }

  removeFile(file) {
    const clear = this.getFiles.indexOf(file);
    this.getFiles.splice(clear, 1);
  }

  addNewSubmission(form: FormGroup) {

    const submission = {
      requirementId: form.value.requirements,
      candidateName: form.value.candidateName,
      accountName: form.value.accountName,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      availability: form.value.availability,
      technology: form.value.technology,
      workLocation: form.value.workLocation,
      enteredBy: this.rtsUserId,
      candidateId: this.selectedCandidate.candidateId
    };

    this.submissionService.addSubmission(submission)
      .subscribe(
        data => {
          if (data.success) {

            if (this.getFiles.length > 0) {
              const upload = {
                file: this.getFiles,
                submissionId: data.submission.submissionId,
                enteredBy: this.rtsUserId
              };
              this.submissionService.uploadFile(upload).subscribe(
                file => {
                  if (file.success) {
                    this.toastr.success(file.message, '', {
                      positionClass: 'toast-top-center',
                      timeOut: 3000,
                    });
                  } else {
                    this.toastr.error(file.message, '', {
                      positionClass: 'toast-top-center',
                      timeOut: 3000,
                    });
                  }
                });
            }
            this.toastr.success('New Submission Successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['recruiter-submissions']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }
}
