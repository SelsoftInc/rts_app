import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as _ from 'underscore';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SubmissionService } from '../Services/submission.service';
import { ToastrService } from 'ngx-toastr';
import { CandidateService } from '../Services/candidate.service';
import * as moment from 'moment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ApiUrl } from '../Services/api-url';
import { NgProgress } from 'ngx-progressbar';

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
  private level1Date: any;
  private level2Date: any;
  private candidateGetFiles: any;
  private candidateFiles: any;
  private immigirationStatus: any;
  private isUpdate: boolean;
  private baseUrl: any;
  private isRelocate: any;
  private allRequirements: any;
  private isWorkedWithClient: boolean;
  private isOtherTechnology: boolean;
  private recruiterName: any;
  private recruiterEmail: any;
  private clientRecruiterName: any;
  private clientRecruiterEmail: any;
  private comment: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private submissionService: SubmissionService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.deletedMediaFiles = [];
    this.candidateGetFiles = [];
    this.allRequirements = [];
    this.recruiterName = [];
    this.recruiterEmail = [];
  }

  ngOnInit() {
    this.ngProgress.start();
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
      candidateEmail: ['', Validators.email],
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
      totalExperience: [''],
      editTotalExperience: [''],
      editCandidateImmigirationStatus: [''],
      editCandidateName: [''],
      editCandidatePhone: [''],
      editCandidateLocation: [''],
      editAvailability: [''],
      editTechnology: [''],
      otherTechnology: [''],
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
      c2c: [''],
      editWorkedWithClient: [''],
      epNumber: [''],
      authorizedWorkInUs: [''],
      workedClient: [''],
      anotherInterviewOffer: [''],
      vacationPlans: [''],
      currentCompany: [''],
      comments: [''],
      units: this.formBuilder.array([
        this.initUnits()
      ]),
    });
    this.getAllRequirementsForUser();
    this.getAllCommonData();
    this.isNewCandidate = false;
  }

  initUnits() {
    return this.formBuilder.group({
      dateStr: [''],
      level: [''],
      status: [''],
      interviewPhoneNumber: ['']
    });
  }

  addUnits() {
    const control = <FormArray>this.myForm.controls['units'];
    control.push(this.initUnits());
  }

  removeUnits(i: number) {
    const control = <FormArray>this.myForm.controls['units'];
    control.removeAt(i);
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
            this.editSubmission();
          }
        });
  }

  editSubmission() {

    const submit = {
      submissionId: this.submissionId,
    };

    this.submissionService.getRequirementBySubmission(submit)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.selectedRequirement = data.requirement;
            const submission = _.findWhere(this.selectedRequirement.submissions, { submissionId: this.submissionId });
            if (submission !== undefined) {
              this.selectedSubmission = submission;
            }
            if (this.selectedSubmission.interviewDetails.length > 0) {
              this.removeUnits(0);
            }
            const control = <FormArray>this.myForm.controls['units'];
            for (const interviews of this.selectedSubmission.interviewDetails) {
              control.push(this.formBuilder.group(interviews));
            }
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
            if (this.selectedSubmission.candidate.workedWithClient) {
              this.myForm.controls.editWorkedWithClient.setValue('true');
              this.isWorkedWithClient = true;
            } else {
              this.myForm.controls.editWorkedWithClient.setValue('false');
              this.isWorkedWithClient = false;
            }
            for (const recruiter of this.selectedRequirement.clientRecuriters) {
              this.recruiterName.push(recruiter.name + ' ');
            }
            this.clientRecruiterName = this.recruiterName.join();

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
            } else if (immigiration === 'TN') {
              this.myForm.controls.candidateImmigirationStatus.setValue('TN');
            }
          }
        });
  }

  getRequirement(event) {
    this.recruiterName = [];
    this.selectedRequirement = _.findWhere(this.allRequirements, { requirementId: event });
    for (const recruiter of this.selectedRequirement.clientRecuriters) {
      this.recruiterName.push(recruiter.name + ' ');
      this.recruiterEmail.push(recruiter.email + ' ');
    }
    this.clientRecruiterName = this.recruiterName.join();
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
            if (this.selectedSubmission.candidate.relocate) {
              this.myForm.controls.editRelocate.setValue('true');
            } else {
              this.myForm.controls.editRelocate.setValue('false');
            }
            if (this.selectedSubmission.candidate.workedWithClient) {
              this.myForm.controls.editWorkedWithClient.setValue('true');
              this.isWorkedWithClient = true;
            } else {
              this.myForm.controls.editWorkedWithClient.setValue('false');
              this.isWorkedWithClient = false;
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
            } else if (immigiration === 'TN') {
              this.myForm.controls.candidateImmigirationStatus.setValue('TN');
            }
            this.addCandidate = false;
            this.isNewCandidate = false;
          } else {
            this.isWorkedWithClient = false;
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

  getWorkedWithClient(event) {
    if (event.value === 'true') {
      this.isWorkedWithClient = true;
    } else {
      this.isWorkedWithClient = false;
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

  getImmigiration(event) {
    if (event !== undefined) {
      this.immigirationStatus = event.value;
    }
  }

  openFiles(media) {
    window.open(this.baseUrl + media.mediaThumbnailPath, '_blank');
  }

  addChatMessage() {
    if (this.comment !== '' && this.comment !== undefined) {
      const addMessage = {
        submissionId: this.submissionId,
        enteredBy: this.rtsUserId,
        comment: this.comment
      };

      this.submissionService.addComment(addMessage)
        .subscribe(
          data => {
            if (data.success) {
              this.selectedSubmission.comments = data.submission.comments;
              this.comment = '';
            }
          });
    }
  }

  updateSubmission(form: FormGroup) {

    if (!this.isUpdate) {
      this.toastr.error('You have no permission to update other recruiter submissions', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    this.ngProgress.start();
    if (this.isNewCandidate) {
      this.createNewCandidate(form);
    } else {
      this.updateCandidateWithSubmission(form, this.selectedSubmission.candidate.candidateId);
    }
  }

  updateCandidateWithSubmission(form: FormGroup, candidateId: any) {

    const submission: any = {
      requirementId: form.value.requirements,
      accountName: form.value.accountName,
      buyingRate: form.value.buyingRate,
      sellingRate: form.value.sellingRate,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      status: form.value.status,
      reasonForRejection: form.value.reasonForRejection,
      interviewStatus: form.value.interviewStatus,
      currentStatus: form.value.currentStatus,
      enteredBy: this.rtsUserId,
      submissionId: this.submissionId,
      candidateId: candidateId,
      interviewDetails: form.value.units,
    };

    if (this.comment === '' || this.comment === undefined) {
      submission.comments = [];
    } else {
      submission.comments = [
        {
          comment: this.comment,
          enteredBy: this.rtsUserId
        }
      ];
    }

    const editSubmission = {
      submission: submission,
      deletedMediaFiles: this.deletedMediaFiles
    };

    this.submissionService.editSubmission(editSubmission)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Update Submission Successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
            this.router.navigate(['submissions']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
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
      totalExperience: form.value.totalExperience,
      currentCompanyName: form.value.currentCompany,
      epNumber: form.value.epNumber,
      authorizedWorkInUS: form.value.authorizedWorkInUs,
      anyOffer: form.value.anotherInterviewOffer,
      vacationPlan: form.value.vacationPlans
    };

    if (this.isWorkedWithClient) {
      candidate.workedWithClient = true;
      candidate.workedClient = form.value.workedClient;
    } else {
      candidate.workedWithClient = false;
      candidate.workedClient = '';
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
          this.ngProgress.done();
        }
      });

  }

}

