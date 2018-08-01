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
  selector: 'app-edit-submissions',
  templateUrl: './edit-submissions.component.html',
  styleUrls: ['./edit-submissions.component.css'],
  providers: [LoggedUserService]
})
export class EditSubmissionsComponent implements OnInit {
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
      { 'name': 'Closed', 'value': 'CLOSED' },
      { 'name': 'Approved', 'value': 'APPROVED' },
      { 'name': 'Rejected', 'value': 'REJECTED' }
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
      editCandidateImmigirationStatus: [''],
      editCandidateName: [''],
      editCandidatePhone: [''],
      editCandidateLocation: [''],
      editAvailability: [''],
      editTechnology: [''],
      editSkype: [''],
      editLinkedIn: ['']
    });
    this.getAllRequirements();
    this.getAllCommonData();
    this.isNewCandidate = false;
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
            for (const sub of this.requirementsDetails) {
              const submission = _.findWhere(sub.submissions, { submissionId: this.submissionId });
              if (submission !== undefined) {
                this.selectedSubmission = submission;
              }
            }
            console.log(this.selectedSubmission);
            this.selectedRequirement = _.findWhere(this.requirementsDetails, { requirementId: this.selectedSubmission.requirementId });
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
          }
        });
  }

  getRequirement(event) {
    this.selectedRequirement = _.findWhere(this.requirementsDetails, { requirementId: event });
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
            this.addCandidate = false;
            this.isNewCandidate = false;
          } else {
            this.addCandidate = true;
            this.isNewCandidate = true;
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
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      status: form.value.status,
      reasonForRejection: form.value.reasonForRejection,
      interviewStatus: form.value.interviewStatus,
      currentStatus: form.value.currentStatus,
      dateOfLevel1: this.level1Date,
      dateOfLevel2: this.level2Date,
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

    const candidate = {
      companyId: this.rtsCompanyId,
      name: form.value.editCandidateName,
      email: form.value.candidateEmail,
      location: form.value.editCandidateLocation,
      availability: form.value.editAvailability,
      phoneNumber: form.value.editCandidatePhone,
      immigirationStatus: form.value.editCandidateImmigirationStatus,
      technology: [{
        technologyId: form.value.editTechnology
      }],
      skype: form.value.editSkype,
      linkedIn: form.value.editLinkedIn
    };

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

