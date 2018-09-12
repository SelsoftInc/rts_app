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
import { ApiUrl } from '../Services/api-url';
import { UserService } from '../Services/user.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-edit-submisson',
  templateUrl: './edit-submisson.component.html',
  styleUrls: ['./edit-submisson.component.css'],
  providers: [LoggedUserService]
})
export class EditSubmissonComponent implements OnInit {

  public myForm: FormGroup;

  private rtsUser: any;
  private userRole: any;
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
  private level1Date: any;
  private level2Date: any;
  private isEmployerDetails: boolean;
  private isC2c: boolean;
  private isOtherTechnology: boolean;
  private candidateGetFiles: any;
  private candidateFiles: any;
  private immigirationStatus: any;
  private recruiterName: any;
  private recruiterEmail: any;
  private clientRecruiterName: any;
  private clientRecruiterEmail: any;
  private allRequirements: any;
  private baseUrl: any;
  private isRelocate: boolean;
  private isWorkedWithClient: boolean;
  private isSubmitted: boolean;
  private plainFormat: boolean;
  private adminUsers: any;
  private dropdownSettings: any;
  private users: any;
  private adminUsersArray: any;
  private customBodyMessage: boolean;
  private defaultBodyMessage: boolean;
  private customMailBody: any;
  private selectedAdmins: any;
  private isCustomBody: boolean;
  private isDefaultBody: boolean;
  private comment: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private activatedRoute: ActivatedRoute,
    private candidateService: CandidateService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private submissionService: SubmissionService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.userRole = this.rtsUser.role;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.sendToClient = false;
    this.recruiterName = [];
    this.adminUsersArray = [];
    this.recruiterEmail = [];
    this.getFiles = [];
    this.allRequirements = [];
    this.candidateGetFiles = [];
    this.deletedMediaFiles = [];
    this.dropdownSettings = {};
    this.adminUsers = [];
    this.customMailBody = '';
    this.selectedAdmins = [];
  }
  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.submissionId = params['id'];
      });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'email',
      textField: 'firstName',
      enableCheckAll: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.baseUrl = ApiUrl.BaseUrl;

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
      relocate: [''],
      editRelocate: [''],
      interview: [''],
      experience: [''],
      resonForChange: [''],
      skype: [''],
      linkedIn: [''],
      interviewStatus: [''],
      currentStatus: [''],
      totalExperience: [''],
      otherTechnology: [''],
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
      adminUser: [''],
      customMailBody: [''],
      comments: [''],
      units: this.formBuilder.array([
        this.initUnits()
      ]),
    });

    this.isNewCandidate = false;

    this.getAllCommonData();
    this.getAllUser();

    if (this.userRole === 'ADMIN') {
      this.status = [
        { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
        { 'name': 'TL Approved', 'value': 'TL_APPROVED' },
        { 'name': 'Approved', 'value': 'APPROVED' },
        { 'name': 'TL Rejeced', 'value': 'TL_REJECTED' },
        { 'name': 'Rejected', 'value': 'REJECTED' },
        { 'name': 'Closed', 'value': 'CLOSED' },
        { 'name': 'Client Rejeced', 'value': 'CLIENT_REJECTED' },
        { 'name': 'Candidate Selected', 'value': 'SELECTED' },
        { 'name': 'Interview', 'value': 'INTERVIEWED' }
      ];
      this.getAllRequirements();
    } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
      this.getAllRequirementsForLeadUserAndAccountManager();
    }

    if (this.userRole === 'TL') {
      this.status = [
        { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
        { 'name': 'TL Approved', 'value': 'TL_APPROVED' },
        { 'name': 'TL Rejeced', 'value': 'TL_REJECTED' },
        { 'name': 'Closed', 'value': 'CLOSED' },
        { 'name': 'Client Rejeced', 'value': 'CLIENT_REJECTED' },
        { 'name': 'Candidate Selected', 'value': 'SELECTED' },
        { 'name': 'Interview', 'value': 'INTERVIEWED' }
      ];
    } else if (this.userRole === 'ACC_MGR') {
      this.status = [
        { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
        { 'name': 'Approved', 'value': 'APPROVED' },
        { 'name': 'Rejected', 'value': 'REJECTED' },
        { 'name': 'Closed', 'value': 'CLOSED' },
        { 'name': 'Client Rejeced', 'value': 'CLIENT_REJECTED' },
        { 'name': 'Candidate Selected', 'value': 'SELECTED' },
        { 'name': 'Interview', 'value': 'INTERVIEWED' }
      ];
    }
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

  getAllUser() {
    const userId = {
      companyId: this.rtsCompanyId
    };

    this.userService.allUsers(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.users = data.users;
            for (const user of this.users) {
              if (user.role === 'ADMIN') {
                this.adminUsers.push({ email: user.email, firstName: user.firstName + ' ' + user.lastName });
              }
            }
            this.adminUsersArray = [{ email: 'pushban@selsoftinc.com', firstName: 'Pushban R' }];
          }
        });
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
      companyId: this.rtsCompanyId
    };

    this.requirementService.requirementsDetails(userId)
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

  getAllRequirementsForLeadUserAndAccountManager() {

    const userId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsByTeam(userId)
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

  getRequirement(event) {
    this.recruiterName = [];
    this.recruiterEmail = [];
    this.selectedRequirement = _.findWhere(this.allRequirements, { requirementId: event });
    for (const recruiter of this.selectedRequirement.clientRecuriters) {
      this.recruiterName.push(recruiter.name + ' ');
      this.recruiterEmail.push(recruiter.email + ' ');
    }
    this.clientRecruiterName = this.recruiterName.join();
    this.clientRecruiterEmail = this.recruiterEmail.join();
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
            }
            this.addCandidate = false;
            this.isNewCandidate = false;
          } else {
            this.isWorkedWithClient = false;
            this.myForm.controls.candidateImmigirationStatus.setValue('GC');
            this.immigirationStatus = 'GC';
            this.addCandidate = true;
            this.isRelocate = true;
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
            // tslint:disable-next-line:max-line-length
            if (this.selectedSubmission.status === 'REJECTED' || this.selectedSubmission.status === 'TL_REJECTED' || this.selectedSubmission.status === 'CLIENT_REJECTED') {
              this.isRejected = true;
            }
            if (this.selectedSubmission.status === 'TL_APPROVED' || this.selectedSubmission.status === 'APPROVED') {
              this.isSubmitted = true;
            } else {
              this.isSubmitted = false;
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
              this.recruiterEmail.push(recruiter.email + ' ');
            }
            this.clientRecruiterName = this.recruiterName.join();
            this.clientRecruiterEmail = this.recruiterEmail.join();

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

  approveSubmission(form: FormGroup) {
    this.ngProgress.start();
    this.sendToClient = true;
    this.updateCandidateWithSubmission(form, this.selectedSubmission.candidate.candidateId);
  }

  submissionToClient() {
    this.ngProgress.start();
    this.selectedAdmins = [];
    for (const user of this.adminUsersArray) {
      this.selectedAdmins.push(user.email);
    }

    const submit = {
      submissionId: this.submissionId,
      submittedBy: this.rtsUserId,
      isPlainFormat: this.plainFormat,
      isCustomBody: this.isCustomBody,
      bodyText: this.customMailBody,
      adminCC: this.selectedAdmins
    };

    this.submissionService.submitToClient(submit)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Submission Successfully send to Client ', '', {
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


  getMailFormat(event) {
    if (event.value === 'Yes') {
      this.plainFormat = true;
    } else {
      this.plainFormat = false;
    }
  }

  getMailBodyMessage(event) {
    if (event.value === 'Yes') {
      this.isDefaultBody = true;
      this.isCustomBody = false;
    } else {
      this.isCustomBody = true;
      this.isDefaultBody = false;
    }
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

  changeStatus(event) {
    if (event === 'REJECTED' || event === 'TL_REJECTED' || event === 'CLIENT_REJECTED') {
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
      location: form.value.location,
      accountName: form.value.accountName,
      clientRate: form.value.clientRate,
      sellingRate: form.value.sellingRate,
      buyingRate: form.value.buyingRate,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      reasonForRejection: form.value.reasonForRejection,
      interviewStatus: form.value.interviewStatus,
      currentStatus: form.value.currentStatus,
      enteredBy: this.rtsUserId,
      submissionId: this.submissionId,
      candidateId: candidateId,
      approvalUserId: this.rtsUserId,
    };

    if (this.sendToClient) {
      submission.status = 'APPROVED';
    } else {
      submission.status = form.value.status;
    }

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

    if (this.sendToClient) {
      if (this.plainFormat === undefined) {
        this.toastr.error('Please Select the Mail Format', '', {
          positionClass: 'toast-top-center',
          timeOut: 3000,
        });
        return false;
      }

      if (this.isCustomBody === undefined || this.isDefaultBody === undefined) {
        this.toastr.error('Please Select the Mail Body', '', {
          positionClass: 'toast-top-center',
          timeOut: 3000,
        });
        return false;
      }
    }

    this.submissionService.editSubmission(editSubmission)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('Update Submission Successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.ngProgress.done();
            if (this.sendToClient) {
              this.submissionToClient();
            } else {
              this.router.navigate(['submissions']);
            }

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
      name: form.value.candidateName,
      email: form.value.candidateEmail,
      location: form.value.candidateLocation,
      availability: form.value.availability,
      phoneNumber: form.value.candidatePhone,
      immigirationStatus: this.immigirationStatus,
      skype: form.value.skype,
      linkedIn: form.value.linkedIn,
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

    if (form.value.technology === 'other') {
      candidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      candidate.technology = [{
        technologyId: form.value.technology
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
