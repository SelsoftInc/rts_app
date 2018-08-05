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
  isEmployerDetails: boolean;
  isC2c: boolean;
  isNewCandidate: boolean;
  candidateGetFiles: any;
  candidateFiles: any;
  isOtherTechnology: boolean;
  technology: any;

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
    this.candidateGetFiles = [];
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
      editCandidateImmigirationStatus: [''],
      editCandidateName: [''],
      editCandidatePhone: [''],
      editCandidateLocation: [''],
      editAvailability: [''],
      editTechnology: [''],
      editSkype: [''],
      editLinkedIn: [''],
      otherTechnology: [''],
      employerName: [''],
      employerContactName: [''],
      employerPhone: [''],
      employerEmail: ['']
    });
    this.getAllRequirementsForUser();
    this.getAllCommonData();
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
            console.log(this.requirementsDetails);
          }
        });
  }

  getAllCommonData() {
    const company = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.commonDetails(company)
      .subscribe(data => {
        if (data.success) {
          this.technology = data.technologies;
          console.log(this.technology);
        }
      });

  }

  getRequirement(event) {
    this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: event });
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

  candidateFileEvent(event: any) {
    this.candidateFiles = event.target.files;
    for (const file of this.candidateFiles) {
      this.candidateGetFiles.push(file);
    }
  }

  candidateRemoveFile(file) {
    const clear = this.candidateGetFiles.indexOf(file);
    this.candidateGetFiles.splice(clear, 1);
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
            if (this.selectedCandidate.isC2C) {
              this.myForm.controls.c2c.setValue('Yes');
              this.isC2c = true;
            } else {
              this.myForm.controls.c2c.setValue('No');
              this.isC2c = false;
            }
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

  getC2c(event) {
    if (event.value === 'Yes') {
      this.isEmployerDetails = true;
    } else {
      this.isEmployerDetails = false;
    }
  }


  addTechnology(event) {
    if (event === 'other') {
      this.isOtherTechnology = true;
      this.myForm.controls.otherTechnology.setValue('');
    } else {
      this.myForm.controls.otherTechnology.setValue(event);
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

    if (this.isEmployerDetails) {
      candidate.c2C = true;
      candidate.employeeName = form.value.employerName;
      candidate.employeeContactName = form.value.employerContactName;
      candidate.employeeContactPhone = form.value.employerPhone;
      candidate.employeeContactEmail = form.value.employerEmail;
    }

    if (form.value.editTechnology === 'other') {
      candidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      candidate.technology = [{
        technologyId: form.value.editTechnology
      }];
    }
    console.log(candidate);

    this.candidateService.addCandidate(candidate)
      .subscribe(data => {
        if (data.success) {

          if (this.candidateGetFiles.length > 0) {
            const upload = {
              file: this.candidateGetFiles,
              candidateId: data.candidate.candidateId,
              enteredBy: this.rtsUserId
            };
            this.candidateService.uploadFile(upload).subscribe(
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
          this.toastr.success('New Candidate Successfully added', '', {
            positionClass: 'toast-top-center',
            timeOut: 3000,
          });

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
