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

@Component({
  selector: 'app-lead-user-edit-submissions',
  templateUrl: './lead-user-edit-submissions.component.html',
  styleUrls: ['./lead-user-edit-submissions.component.css'],
  providers: [LoggedUserService]
})
export class LeadUserEditSubmissionsComponent implements OnInit {

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
  private status: any;
  private isRejected: boolean;
  private selectedRequirement: any;
  private sendToClient: boolean;
  private addCandidate: boolean;
  private isSubmitToClient: boolean;
  private isNewCandidate: boolean;
  private technology: any[];
  private level1Date: string;
  private level2Date: string;
  private isEmployerDetails: boolean;
  private isC2c: boolean;
  private isOtherTechnology: boolean;
  immigirationStatus: any;

  constructor(private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService,
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
    this.status = [
      { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
      { 'name': 'TL Approved', 'value': 'TL_APPROVED' },
      { 'name': 'TL Rejeced', 'value': 'TL_REJECTED' },
      { 'name': 'Closed', 'value': 'CLOSED' },
    ];
  }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.submissionId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      requirements: [''],
      candidateName: [''],
      clientContactname: [''],
      clientContactEmail: [''],
      accountName: [''],
      location: [''],
      clientRate: [''],
      sellingRate: [''],
      buyingRate: [''],
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
      interviewStatus: [''],
      currentStatus: [''],
      level1Date: [''],
      level2Date: [''],
      statusForLevel1: [''],
      statusForLevel2: [''],
      editCandidateImmigirationStatus: [''],
      editCandidateName: [''],
      editCandidatePhone: [''],
      editCandidateLocation: [''],
      editAvailability: [''],
      editTechnology: [''],
      otherTechnology: [''],
      editSkype: [''],
      editLinkedIn: [''],
      employerName: [''],
      employerContactName: [''],
      employerPhone: [''],
      employerEmail: [''],
      c2c: ['']
    });
    this.getAllRequirements();
    this.getAllCommonData();
    this.isNewCandidate = false;
  }

  getAllCommonData() {
    const company = {
      userId: this.rtsUserId
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
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsByTeam(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.requirementsDetails = data.requirements;
            for (const sub of this.requirementsDetails) {
              const submission = _.findWhere(sub.submissions, { submissionId: this.submissionId });
              if (submission !== undefined) {
                this.selectedSubmission = submission;
              }
            }
            this.selectedRequirement = _.findWhere(this.requirementsDetails, { requirementId: this.selectedSubmission.requirementId });
            console.log(this.selectedRequirement);
            if (this.selectedSubmission.status === 'REJECTED') {
              this.isRejected = true;
            }
            if (this.selectedSubmission.approvedByAdmin === true) {
              this.sendToClient = true;
            } else {
              this.sendToClient = false;
            }
            if (this.selectedSubmission.clientSubmissionOn === 0) {
              this.isSubmitToClient = true;
            } else {
              this.isSubmitToClient = false;
            }
            if (this.selectedSubmission.candidate.c2C) {
              this.myForm.controls.c2c.setValue('Yes');
              this.isC2c = true;
            } else {
              this.myForm.controls.c2c.setValue('No');
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
    this.selectedRequirement = _.findWhere(this.requirementsDetails, { requirementId: event });
    console.log(this.selectedRequirement);
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
            if (this.selectedSubmission.candidate.isC2C) {
              this.myForm.controls.c2c.setValue('Yes');
              this.isC2c = true;
            } else {
              this.myForm.controls.c2c.setValue('No');
            }
            this.addCandidate = false;
            this.isNewCandidate = false;
          } else {
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

  removeUploadedFile(media) {
    this.deletedMediaFiles.push(media.mediaId);
    const clear = this.selectedSubmission.mediaFiles.indexOf(media);
    this.selectedSubmission.mediaFiles.splice(clear, 1);
  }

  changeStatus(event) {
    if (event === 'REJECTED') {
      this.isRejected = true;
    } else {
      this.isRejected = false;
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

  getC2c(event) {
    if (event.value === 'Yes') {
      this.isEmployerDetails = true;
    } else {
      this.isEmployerDetails = false;
    }
  }

  getImmigiration(event) {
    if (event !== undefined) {
      this.immigirationStatus = event.value;
    }
  }


  submissionToClient() {

    const submit = {
      submissionId: this.submissionId,
      submittedBy: this.rtsUserId
    };

    this.submissionService.submitToClient(submit)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Submission Successfully send to Client ', '', {
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


  updateSubmission(form: FormGroup) {
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
      location: form.value.location,
      accountName: form.value.accountName,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      buyingRate: form.value.buyingRate,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      status: form.value.status,
      reasonForRejection: form.value.reasonForRejection,
      interviewStatus: form.value.interviewStatus,
      currentStatus: form.value.currentStatus,
      dateOfLevel1: this.level1Date,
      dateOfLevel2: this.level2Date,
      statusForLevel1: form.value.statusForLevel1,
      statusForLevel2: form.value.statusForLevel2,
      enteredBy: this.rtsUserId,
      submissionId: this.submissionId,
      candidateId: candidateId,
      approvalUserId: this.rtsUserId
    };
    const editSubmission = {
      submission: submission,
      deletedMediaFiles: this.deletedMediaFiles
    };
    console.log(editSubmission);

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
      immigirationStatus: this.immigirationStatus,
      skype: form.value.editSkype,
      linkedIn: form.value.editLinkedIn
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

