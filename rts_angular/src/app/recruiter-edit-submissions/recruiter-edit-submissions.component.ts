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
  immigration: any;
  isSelected: boolean;
  joinDate: any;
  isRejected: boolean;
  submissionStatus: any;
  status: any;
  statusObj: any;
  selectedSkills: any;
  skills: any;
  selectedSkillsText: string;
  addCustomSkills = (skill) => ({ skillId: 0, name: skill });
  // submissionComment: any;

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
    this.submissionStatus = [];
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
      interviewComments: [''],
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
      enteredUser: [''],
      createdDate: [''],
      joiningDate: [''],
      locationPreferences: [''],
      workedAsFullTime: [''],
      graduationYear: [''],
      educationCredentials: [''],
      dateOfBirth: [''],
      currentProject: [''],
      totalUsExperience: [''],
      skills: [''],
      note: [''],
      summary: [''],
      units: this.formBuilder.array([
        this.initUnits()
      ]),
      skillsExperience: this.formBuilder.array([
        this.initSkills()
      ]),
    });
    this.getAllCommonData();
    this.getAllSkills();
    this.isNewCandidate = false;
  }

  initUnits() {
    return this.formBuilder.group({
      dateStr: [''],
      timeZone: [''],
      time: ['', Validators.pattern('^([0-1][0-9]):([0-5][0-9])+ ((AM)|(PM)|(am)|(pm))$')],
      level: [''],
      status: [''],
      interviewPhoneNumber: [''],
    });
  }
  initSkills() {
    return this.formBuilder.group({
      name: [''],
      expYear: [''],
      skillId: ['']
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

  addSkill() {
    const control = <FormArray>this.myForm.controls['skillsExperience'];
    control.push(this.initSkills());
  }
  removeSkill(i: number) {
    const control = <FormArray>this.myForm.controls['skillsExperience'];
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
          this.immigration = data.visaStatus;
          this.submissionStatus = data.userSubmissionStatus;
          for (const immigration of this.immigration) {
            immigration.isChecked = false;
          }
          // this.getAllRequirementsForUser();
          this.editSubmission();
        }
      });
  }
  getAllSkills() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.getAllSkills(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.skills = data.skills;
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
            // this.editSubmission();
          }
        });
  }

  editSubmission() {

    const submit = {
      submissionId: parseInt(this.submissionId),
    };

    this.submissionService.getRequirementBySubmission(submit)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.selectedRequirement = data.requirement;
            this.allRequirements.push(this.selectedRequirement);
            const submission = _.findWhere(this.selectedRequirement.submissions, { submissionId: parseInt(this.submissionId) });
            if (submission !== undefined) {
              this.selectedSubmission = submission;
            }
            var skillExperience = [];
            console.log(this.selectedSubmission)
            this.status = this.selectedSubmission.submissionStatus.statusId;
            this.statusObj = this.selectedSubmission.submissionStatus;
            this.isC2c = this.selectedSubmission.candidate.c2C;
            this.isRelocate = this.selectedSubmission.candidate.relocate;
            this.isWorkedWithClient = this.selectedSubmission.candidate.workedWithClient;
            this.selectedSkills = this.selectedSubmission.candidate.skills;
            skillExperience = this.selectedSubmission.candidate.skills;
            var skillText = [];
            for (const skill of this.selectedSkills) {
              skillText.push(skill.name + ' ');
            }
            for (const skill of skillExperience) {
              if (!skill.expYear || skill.expYear === "") {
                skill.expYear = null;
              }
            }
            this.selectedSkillsText = skillText.join();
            const isStatusExiting = _.findIndex(this.submissionStatus, this.statusObj)
            if (isStatusExiting === -1) {
              this.submissionStatus.push(this.statusObj);
            }
            if (this.selectedSubmission.interviewDetails.length > 0) {
              this.removeUnits(0);
            }
            if (this.selectedSkills.length > 0) {
              this.removeSkill(0);
            }
            const control = <FormArray>this.myForm.controls['units'];
            for (const interviews of this.selectedSubmission.interviewDetails) {
              if (!interviews.timeZone) {
                interviews.timeZone = 'EST';
              }
              if (!interviews.time) {
                if (interviews.dateStr !== "") {
                  let newDate = new Date(interviews.dateStr);
                  interviews.time = moment(newDate).format('h:mm a');
                }else {
                  interviews.time = "";
                }
              }
              control.push(this.formBuilder.group(interviews));
            }
            const controlSkill = <FormArray>this.myForm.controls['skillsExperience'];
            for (const skill of skillExperience) {
              controlSkill.push(this.formBuilder.group(skill));
            }
            if (this.selectedSubmission.submittedUser.userId === parseInt(this.rtsUserId)) {
              this.isUpdate = true;
            } else {
              this.isUpdate = false;
            }
            if (this.status === 5 || this.status === 4 || this.status === 7 || this.status === 14) {
              this.isRejected = true;
            }
            if (this.selectedSubmission.interviewDetailStatus === 'SELECTED') {
              this.isSelected = true;
              this.joinDate = moment(this.selectedSubmission.joiningDateStr).format('DD/MM/YYYY');
            } else {
              this.isSelected = false;
            }
            for (const recruiter of this.selectedRequirement.toClientRecruiters) {
              this.recruiterName.push(recruiter.name + ' ');
            }
            this.clientRecruiterName = this.recruiterName.join();

            const immigirationStatus = this.selectedSubmission.candidate.visaStatus;
            for (const visaStatus of this.immigration) {
              if (_.isEqual(immigirationStatus.visaStatusId, visaStatus.visaStatusId)) {
                visaStatus.isChecked = true;
              }
            }
          }
        });
  }


  getRequirement(event) {
    this.recruiterName = [];
    this.selectedRequirement = _.findWhere(this.allRequirements, { requirementId: event });
    for (const recruiter of this.selectedRequirement.toClientRecruiters) {
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
            this.isC2c = this.selectedSubmission.candidate.c2C;
            this.isRelocate = this.selectedSubmission.candidate.relocate;
            this.isWorkedWithClient = this.selectedSubmission.candidate.workedWithClient;
            this.selectedSkills = this.selectedSubmission.candidate.skills;
            var skillText = [];
            for (const skill of this.selectedSkills) {
              skillText.push(skill.name + ' ');
            }
            this.selectedSkillsText = skillText.join();
            for (const immigration of this.immigration) {
              immigration.isChecked = false;
            }
            const controlSkill = <FormArray>this.myForm.controls['skillsExperience'];
            while (controlSkill.length !== 0) {
              this.removeSkill(0);
            }
            if (this.selectedSkills.length === 0) {
              controlSkill.push(this.initSkills());
            }
            for (const skill of this.selectedSkills) {
              controlSkill.push(this.formBuilder.group(skill));
            }
            const immigirationStatus = this.selectedSubmission.candidate.visaStatus;
            for (const immigration of this.immigration) {
              if (_.isEqual(immigirationStatus.visaStatusId, immigration.visaStatusId)) {
                immigration.isChecked = true;
              }
            }
            this.addCandidate = false;
            this.isNewCandidate = false;
          } else {
            const controlSkill = <FormArray>this.myForm.controls['skillsExperience'];
            while (controlSkill.length !== 0) {
              this.removeSkill(0);
            }
            if (controlSkill.length === 0) {
              controlSkill.push(this.initSkills());
            }
            this.selectedSkills = [];
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

  changeStatus(event) {
    if (event === '14') {
      this.isRejected = true;
    } else {
      this.isRejected = false;
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
    this.deletedMediaFiles.push(media.mediaFileId);
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
      this.immigirationStatus = { visaStatusId: event };
    }
  }

  openFiles(media) {
    window.open(this.baseUrl + media.mediaThumbnailPath, '_blank');
  }

  addChatMessage() {
    if (this.comment !== '' && this.comment !== undefined) {
      const addMessage = {
        submissionId: parseInt(this.submissionId),
        enteredBy: this.rtsUserId,
        comment: this.comment
      };

      this.submissionService.addComment(addMessage)
        .subscribe(
          data => {
            if (data.success) {
              this.selectedSubmission.comments = data.submission.comments;
              // this.submissionComment = data.submission.comments;
              // console.log(this.submissionComment)
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
      requirementId: parseInt(form.value.requirements),
      accountName: form.value.accountName,
      buyingRate: form.value.buyingRate,
      sellingRate: form.value.sellingRate,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      statusId: parseInt(form.value.status),
      reasonForRejection: form.value.reasonForRejection,
      interviewStatus: form.value.interviewComments,
      interviewDetailStatus: form.value.interviewStatus,
      currentStatus: form.value.currentStatus,
      enteredBy: this.rtsUserId,
      submissionId: parseInt(this.submissionId),
      candidateId: candidateId,
      interviewDetails: form.value.units,
      joiningDateStr: this.selectedSubmission.joiningDateStr,
      comments: this.selectedSubmission.comments,
      note: form.value.note,
      summary: form.value.summary,
    };

    this.submissionService.editSubmission(submission)
      .subscribe(
        data => {
          this.ngProgress.done();
          if (data.success) {
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


    var skillsWithExp = [];
    for (const skill of form.value.skillsExperience) {
      if (skill.skillId.companyId) {
        skillsWithExp.push({
          skillId: skill.skillId.skillId,
          expYear: +skill.expYear,
          companyId: skill.skillId.companyId,
          name: skill.skillId.name,
        });
      } else {
        skillsWithExp.push({
          skillId: skill.skillId.skillId,
          expYear: +skill.expYear,
          name: skill.skillId.name,
        });
      }
    }

    const candidate: any = {
      companyId: this.rtsCompanyId,
      name: form.value.editCandidateName,
      email: form.value.candidateEmail,
      location: form.value.editCandidateLocation,
      availability: form.value.editAvailability,
      phoneNumber: form.value.editCandidatePhone,
      visaStatus: this.immigirationStatus,
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
      vacationPlan: form.value.vacationPlans,
      locationPreferences: form.value.locationPreferences,
      workedAsFullTime: form.value.workedAsFullTime,
      graduationYear: form.value.graduationYear,
      educationCredentials: form.value.educationCredentials,
      dateOfBirth: form.value.dateOfBirth,
      currentProject: form.value.currentProject,
      totalUsExperience: form.value.totalUsExperience,
      skills: skillsWithExp,
      enteredBy: parseInt(this.rtsUserId)
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

