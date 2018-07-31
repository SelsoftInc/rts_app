import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import { SubmissionService } from '../Services/submission.service';
import { CandidateService } from '../Services/candidate.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-add-new-submissions',
  templateUrl: './add-new-submissions.component.html',
  styleUrls: ['./add-new-submissions.component.css'],
  providers: [LoggedUserService]
})
export class AddNewSubmissionsComponent implements OnInit {

  public myForm: FormGroup;
  private rtsUser: any;
  private rtsUserId: any;
  private requirementsDetails: any;
  private files: any;
  private getFiles: any;
  private rtsCompanyId: any;
  private status: any;
  private selectedCandidate: any;
  private technologies: any;
  private isCandidate: boolean;
  private selectRequiement: any;
  private isNewCandidate: boolean;
  private technology: any;
  private requirementId: any;
  private isOtherTechnology: boolean;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private submissionService: SubmissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.selectedCandidate = {};
    // this.selectRequiement = {};
    this.status = [
      { 'name': 'Open', 'value': 'OPEN' },
      { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
      { 'name': 'Closed', 'value': 'CLOSED' }
    ];
  }

  ngOnInit() {

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });

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
      editCandidateImmigirationStatus: [''],
      editCandidateName: [''],
      editCandidatePhone: [''],
      editCandidateLocation: [''],
      editAvailability: [''],
      editTechnology: [''],
      editSkype: [''],
      editLinkedIn: [''],
      otherTechnology: ['']
    });
    this.getAllRequirements();
    this.getAllCommonData();
  }

  getAllCommonData() {
    const company = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.commonDetails(company)
      .subscribe(data => {
        if (data.success) {
          this.technology = data.technologies;
        }
      });

  }

  getAllRequirements() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails = data.requirements;
            this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: this.requirementId });
          }
        });
  }

  getRequirement(event) {
    this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: event });
    console.log(this.selectRequiement);
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

  getCandidateDetails() {
    const candidate = {
      email: this.myForm.controls.candidateEmail.value,
      companyId: this.rtsCompanyId
    };
    console.log(candidate);

    this.candidateService.getCandidate(candidate)
      .subscribe(
        data => {
          console.log(data);
          if (data.success) {
            this.selectedCandidate = data.candidate;
            this.isCandidate = true;
            this.isNewCandidate = false;
          } else {
            this.isCandidate = false;
            this.isNewCandidate = true;
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

  addTechnology(event) {
    if (event === 'other') {
      this.isOtherTechnology = true;
      this.myForm.controls.otherTechnology.setValue('');
    } else {
      this.isOtherTechnology = false;
    }
  }


  addNewSubmission(form: FormGroup) {

    if (form.value.clientRate === '' || form.value.clientRate === null) {
      this.toastr.error('Client Rate should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (form.value.sellingRate === '' || form.value.sellingRate === null) {
      this.toastr.error('Selling Rate should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (this.isNewCandidate) {
      this.createNewCandidate(form);
    } else {
      this.SubmissionWithCandidate(form, this.selectedCandidate.candidateId);
    }

  }

  SubmissionWithCandidate(form: FormGroup, candidateId: any) {

    const submission = {
      requirementId: form.value.requirements,
      accountName: form.value.accountName,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      enteredBy: this.rtsUserId,
      candidateId: candidateId
    };

    console.log(submission);

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
            this.router.navigate(['submissions']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

  createNewCandidate(form: FormGroup) {

    const candidate: any = {
      companyId: this.rtsCompanyId,
      name: form.value.editCandidateName,
      email: form.value.candidateEmail,
      location: form.value.editCandidateLocation,
      availability: form.value.editAvailability,
      phoneNumber: form.value.editCandidatePhone,
      immigirationStatus: form.value.editCandidateImmigirationStatus,
      skype: form.value.editSkype,
      linkedIn: form.value.editLinkedIn
    };

    if (form.value.technologies === 'other') {
      candidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      candidate.technology = [{
        technologyId: form.value.technologies
      }];
    }

    this.candidateService.addCandidate(candidate)
      .subscribe(data => {
        if (data.success) {
          this.SubmissionWithCandidate(form, data.candidate.candidateId);
        } else {
          this.toastr.error(data.message, '', {
            positionClass: 'toast-top-center',
            timeOut: 3000,
          });
        }
      });

  }

}
