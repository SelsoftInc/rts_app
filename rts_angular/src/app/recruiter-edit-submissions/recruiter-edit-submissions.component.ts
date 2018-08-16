import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubmissionService } from '../Services/submission.service';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from '../Services/candidate.service';
import * as moment from 'moment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ApiUrl } from '../Services/api-url';

@Component({
  selector: 'app-recruiter-edit-submissions',
  templateUrl: './recruiter-edit-submissions.component.html',
  styleUrls: ['./recruiter-edit-submissions.component.css'],
  providers: [LoggedUserService]
})
export class RecruiterEditSubmissionsComponent implements OnInit {

  public myForm: FormGroup;
  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;
  private submissionId: any;
  private selectedSubmission: any;
  private requirementsDetails: any;
  private getFiles: any;
  private files: any;
  private deletedMediaFiles: any;
  private selectedRequirement: any;
  private addCandidate: boolean;
  private technology: any;
  private isNewCandidate: boolean;
  private isC2c: boolean;
  private isEmployerDetails: boolean;
  private level1Date: string;
  private level2Date: string;
  private candidateGetFiles: any;
  private candidateFiles: any;
  private immigirationStatus: any;
  private isUpdate: boolean;
  private baseUrl: any;
  private isRelocate: any;
  private allRequirements: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private submissionService: SubmissionService,
    private router: Router
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.deletedMediaFiles = [];
    this.candidateGetFiles = [];
    this.allRequirements = [];
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.submissionId = params['id'];
      });

    this.baseUrl = ApiUrl.BaseUrl;

    this.myForm = this.formBuilder.group({
      requirements: ['', Validators.required],
      candidateName: [''],
      clientContactname: [''],
      clientContactEmail: [''],
      accountName: [''],
      location: [''],
      buyingRate: [''],
      sellingRate: [''],
      status: [''],
      reasonForRejection: [''],
      availability: [''],
      candidateEmail: [''],
      candidatePhone: [''],
      candidateLocation: [''],
      candidateImmigirationStatus: [''],
      technology: [''],
      workLocation: [''],
      skype: [''],
      linkedIn: [''],
      relocate: [''],
      interview: [''],
      experience: [''],
      resonForChange: [''],
      interviewStatus: [''],
      currentStatus: [''],
      level1Date: [''],
      level2Date: [''],
      statusForLevel1: [''],
      statusForLevel2: [''],
      totalExperience: [''],
      editTotalExperience: [''],
      editCandidateImmigirationStatus: [''],
      editCandidateName: [''],
      editCandidatePhone: [''],
      editCandidateLocation: [''],
      editAvailability: [''],
      editTechnology: [''],
      editRelocate: [''],
      editInterview: [''],
      editExperience: [''],
      editResonForChange: [''],
      editSkype: [''],
      editLinkedIn: [''],
      employerName: [''],
      employerContactName: [''],
      employerPhone: [''],
      employerEmail: [''],
      c2c: ['']
    });
    this.getAllRequirementsForUser();
    this.getAllCommonData();
    this.isNewCandidate = false;
  }

  getAllCommonData() {
    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(userId)
      .subscribe(data => {
        if (data.success) {
          this.technology = data.technologies;
        }
      });

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
            for (const require of this.requirementsDetails) {
              if (require.status !== 'Draft') {
                this.allRequirements.push(require);
              }
            }
            for (const sub of this.allRequirements) {
              const submission = _.findWhere(sub.submissions, { submissionId: this.submissionId });
              if (submission !== undefined) {
                this.selectedSubmission = submission;
              }
            }
            this.selectedRequirement = _.findWhere(this.allRequirements, { requirementId: this.selectedSubmission.requirementId });
            if (this.selectedSubmission.enteredBy === this.rtsUserId) {
              this.isUpdate = true;
            } else {
              this.isUpdate = false;
            }
            if (this.selectedSubmission.candidate.c2C) {
              this.myForm.controls.c2c.setValue('Yes');
              this.isC2c = true;
            } else {
              this.myForm.controls.c2c.setValue('No');
            }
            if (this.selectedSubmission.candidate.relocate) {
              this.myForm.controls.editRelocate.setValue('true');
              this.isRelocate = true;
            } else {
              this.myForm.controls.editRelocate.setValue('false');
              this.isRelocate = false;
            }
            const immigiration = this.selectedSubmission.candidate.immigirationStatus;
            if (immigiration === 'GC') {
              this.myForm.controls.candidateImmigirationStatus.setValue('GC');
            } else if (immigiration === 'CITIZEN') {
              this.myForm.controls.candidateImmigirationStatus.setValue('CITIZEN');
            } else if (immigiration === 'H1B') {
              this.myForm.controls.candidateImmigirationStatus.setValue('H1B');
            } else if (immigiration === 'W2/1099') {
              this.myForm.controls.candidateImmigirationStatus.setValue('W2/1099');
            } else if (immigiration === 'OPT/CPT') {
              this.myForm.controls.candidateImmigirationStatus.setValue('OPT/CPT');
            } else if (immigiration === 'EAD') {
              this.myForm.controls.candidateImmigirationStatus.setValue('EAD');
            } else if (immigiration === 'H4AD') {
              this.myForm.controls.candidateImmigirationStatus.setValue('H4AD');
            }
          }
        });
  }

  getRequirement(event) {
    this.selectedRequirement = _.findWhere(this.allRequirements, { requirementId: event });
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
            this.selectedSubmission.candidate = data.candidate;
            if (this.selectedSubmission.candidate.c2C) {
              this.myForm.controls.c2c.setValue('Yes');
              this.isC2c = true;
            } else {
              this.myForm.controls.c2c.setValue('No');
            }
            if (this.selectedSubmission.candidate.isRelocate) {
              this.myForm.controls.editRelocate.setValue('true');
            } else {
              this.myForm.controls.editRelocate.setValue('false');
            }
            this.addCandidate = false;
            this.isNewCandidate = false;
          } else {
            this.myForm.controls.editCandidateImmigirationStatus.setValue('GC');
            this.immigirationStatus = 'GC';
            this.isRelocate = true;
            this.addCandidate = true;
            this.isNewCandidate = true;
            this.myForm.controls.c2c.setValue('No');
            this.isC2c = false;
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
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

  removeUploadedFile(media) {
    this.deletedMediaFiles.push(media.mediaId);
    const clear = this.selectedSubmission.mediaFiles.indexOf(media);
    this.selectedSubmission.mediaFiles.splice(clear, 1);
  }

  getC2c(event) {
    if (event.value === 'Yes') {
      this.isEmployerDetails = true;
    } else {
      this.isEmployerDetails = false;
    }
  }

  relocate(event) {
    if (event.value === 'true') {
      this.isRelocate = true;
    } else {
      this.isRelocate = false;
    }
  }

  getImmigiration(event) {
    if (event !== undefined) {
      this.immigirationStatus = event.value;
    }
  }

  openFiles(media) {
    window.open(this.baseUrl + media.mediaThumbnailPath, '_blank');
  }

  updateSubmission(form: FormGroup) {

    if (!this.isUpdate) {
      this.toastr.error('You have no permission to update other recruiter submissions', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    if (this.isNewCandidate) {
      this.createNewCandidate(form);
    } else {
      this.updateCandidateWithSubmission(form, this.selectedSubmission.candidate.candidateId);
    }
  }

  updateCandidateWithSubmission(form: FormGroup, candidateId: any) {

    if (form.value.level1Date !== 'Invalid date' && form.value.level1Date !== '') {
      this.level1Date = moment(form.value.level1Date).format('YYYY-MM-DD');
    } else {
      this.level1Date = '';
    }
    if (form.value.level1Date !== 'Invalid date' && form.value.level1Date !== '') {
      this.level2Date = moment(form.value.level2Date).format('YYYY-MM-DD');
    } else {
      this.level2Date = '';
    }

    const submission = {
      requirementId: form.value.requirements,
      accountName: form.value.accountName,
      buyingRate: form.value.buyingRate,
      sellingRate: form.value.sellingRate,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      status: form.value.status,
      interviewStatus: form.value.interviewStatus,
      currentStatus: form.value.currentStatus,
      dateOfLevel1: this.level1Date,
      dateOfLevel2: this.level2Date,
      statusForLevel1: form.value.statusForLevel1,
      statusForLevel2: form.value.statusForLevel2,
      enteredBy: this.rtsUserId,
      submissionId: this.submissionId,
      candidateId: candidateId,
    };
    const editSubmission = {
      submission: submission,
      deletedMediaFiles: this.deletedMediaFiles
    };


    this.submissionService.editSubmission(editSubmission)
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
            this.toastr.success('Update Submission Successfully', '', {
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
      immigirationStatus: this.immigirationStatus,
      skype: form.value.editSkype,
      linkedIn: form.value.editLinkedIn,
      relocate: this.isRelocate,
      availableTimeForInterview: form.value.interview,
      reasonForChange: form.value.resonForChange,
      experience: form.value.experience,
      totalExperience: form.value.totalExperience
    };

    if (form.value.editTechnology === 'other') {
      candidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      candidate.technology = [{
        technologyId: form.value.editTechnology
      }];
    }

    if (this.isEmployerDetails) {
      candidate.c2C = true;
      candidate.employeeName = form.value.employerName;
      candidate.employeeContactName = form.value.employerContactName;
      candidate.employeeContactPhone = form.value.employerPhone;
      candidate.employeeContactEmail = form.value.employerEmail;
    }

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

          this.updateCandidateWithSubmission(form, data.candidate.candidateId);
        } else {
          this.toastr.error(data.message, '', {
            positionClass: 'toast-top-center',
            timeOut: 3000,
          });
        }
      });

  }

}

