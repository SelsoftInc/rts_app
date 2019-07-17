import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import { SubmissionService } from '../Services/submission.service';
import { CandidateService } from '../Services/candidate.service';
import * as _ from 'underscore';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ApiUrl } from '../Services/api-url';
import { NgProgress } from 'ngx-progressbar';

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
  private candidateFiles: any;
  private candidateGetFiles: any;
  private isEmployerDetails: boolean;
  private userRole: any;
  private isC2c: boolean;
  private immigirationStatus: any;
  private clientRecruiterName: any;
  private clientRecruiterEmail: any;
  private recruiterName: any;
  private recruiterEmail: any;
  private allRequirements: any;
  private baseUrl: any;
  private isRelocate: any;
  isWorkedWithClient: boolean;
  immigration: any;
  isFileAttchements: boolean;
  skills: any;
  addCustomSkills = (skill) => ({ skillId: 0, name: skill });
  selectedSkills: any;
  // selectedSkillsText: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private submissionService: SubmissionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.isRelocate = true;
    this.isWorkedWithClient = false;
    this.recruiterName = [];
    this.recruiterEmail = [];
    this.allRequirements = [];
    this.getFiles = [];
    this.candidateGetFiles = [];
    this.selectedCandidate = {};
    this.status = [
      { 'name': 'Open', 'value': 'OPEN' },
      { 'name': 'In-Progress', 'value': 'IN-PROGRESS' },
      { 'name': 'Closed', 'value': 'CLOSED' }
    ];
  }

  ngOnInit() {
    this.ngProgress.start();

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.requirementId = params['id'];
      });

    this.baseUrl = ApiUrl.BaseUrl;

    this.myForm = this.formBuilder.group({
      requirements: [''],
      candidateEmail: ['', Validators.email],
      candidatePhone: [''],
      clientContactname: [''],
      clientContactEmail: [''],
      candidateName: [''],
      accountName: [''],
      clientRate: [''],
      buyingRate: [''],
      sellingRate: [''],
      status: [''],
      availability: [''],
      technology: [''],
      workLocation: [''],
      candidateImmigirationStatus: [''],
      candidateLocation: [''],
      skype: [''],
      linkedIn: [''],
      relocate: [''],
      interview: [''],
      experience: [''],
      totalExperience: [''],
      resonForChange: [''],
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
      editRelocate: [''],
      editTotalExperience: [''],
      editInterview: [''],
      editExperience: [''],
      editResonForChange: [''],
      employerName: [''],
      employerContactName: [''],
      employerPhone: [''],
      employerEmail: [''],
      editWorkedWithClient: [''],
      epNumber: [''],
      authorizedWorkInUs: [''],
      workedClient: [''],
      anotherInterviewOffer: [''],
      vacationPlans: [''],
      currentCompany: [''],
      enteredUser: [''],
      createdDate: [''],
      locationPreferences: [''],
      workedAsFullTime: [''],
      graduationYear: [''],
      educationCredentials: [''],
      dateOfBirth: [''],
      currentProject: [''],
      totalUsExperience: [''],
      skills: ['']
    });
    this.getAllCommonData();
    this.getAllSkills();
    this.getRequirementById();
    // if (this.userRole === 'ADMIN') {
    //   this.getAllRequirements();
    // } else if (this.userRole === 'TL' || this.userRole === 'ACC_MGR') {
    //   this.getAllRequirementsForTeam();
    // } else if (this.userRole === 'RECRUITER' || this.userRole === 'TRAINEE') {
    //   this.getAllRequirementsForUser();
    // }
    // this.myForm.controls.editCandidateImmigirationStatus.setValue('GC');
    // this.immigirationStatus = 'GC';
  }

  getAllCommonData() {
    const company = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(company)
      .subscribe(data => {
        if (data.success) {
          this.technology = data.technologies;
          this.immigration = data.visaStatus;
          for (const immigration of this.immigration) {
            immigration.isChecked = false;
          }
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

  getRequirementById() {
    const userId = {
      requirementId: this.requirementId
    };

    this.requirementService.getRequirementsById(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.selectRequiement = data.requirement;
            if (this.selectRequiement !== undefined) {
              this.allRequirements.push(this.selectRequiement);
              for (const recruiter of this.selectRequiement.toClientRecruiters) {
                this.recruiterName.push(recruiter.name + ' ');
                this.recruiterEmail.push(recruiter.email + ' ');
              }
              this.clientRecruiterName = this.recruiterName.join();
              this.clientRecruiterEmail = this.recruiterEmail.join();
            }
          }
        })
  }

  getAllRequirementsForTeam() {

    const teamId = {
      userId: this.rtsUserId
    };

    this.requirementService.requirementsDetailsByTeam(teamId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.requirementsDetails = data.requirements;
            for (const require of this.requirementsDetails) {
              if (require.status !== 'Draft') {
                this.allRequirements.push(require);
              }
            }
            this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: parseInt(this.requirementId) });
            if (this.selectRequiement !== undefined) {
              for (const recruiter of this.selectRequiement.toClientRecruiters) {
                this.recruiterName.push(recruiter.name + ' ');
                this.recruiterEmail.push(recruiter.email + ' ');
              }
              this.clientRecruiterName = this.recruiterName.join();
              this.clientRecruiterEmail = this.recruiterEmail.join();
            }
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
            this.ngProgress.done();
            this.requirementsDetails = data.requirements;
            for (const require of this.requirementsDetails) {
              if (require.status !== 'Draft') {
                this.allRequirements.push(require);
              }
            }
            this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: parseInt(this.requirementId) });
            if (this.selectRequiement !== undefined) {
              for (const recruiter of this.selectRequiement.toClientRecruiters) {
                this.recruiterName.push(recruiter.name + ' ');
                this.recruiterEmail.push(recruiter.email + ' ');
              }
              this.clientRecruiterName = this.recruiterName.join();
              this.clientRecruiterEmail = this.recruiterEmail.join();
            }
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
            this.ngProgress.done();
            this.requirementsDetails = data.requirements;
            for (const require of this.requirementsDetails) {
              if (require.status !== 'Draft') {
                this.allRequirements.push(require);
              }
            }
            this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: parseInt(this.requirementId) });
            if (this.selectRequiement !== undefined) {
              for (const recruiter of this.selectRequiement.toClientRecruiters) {
                this.recruiterName.push(recruiter.name + ' ');
                this.recruiterEmail.push(recruiter.email + ' ');
              }
              this.clientRecruiterName = this.recruiterName.join();
              this.clientRecruiterEmail = this.recruiterEmail.join();
            }
          }
        });
  }

  getRequirement(event) {
    this.recruiterName = [];
    this.recruiterEmail = [];
    this.selectRequiement = _.findWhere(this.requirementsDetails, { requirementId: parseInt(event) });
    for (const recruiter of this.selectRequiement.toClientRecruiters) {
      this.recruiterName.push(recruiter.name + ' ');
      this.recruiterEmail.push(recruiter.email + ' ');
    }
    this.clientRecruiterName = this.recruiterName.join();
    this.clientRecruiterEmail = this.recruiterEmail.join();
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
            // console.log(this.selectedCandidate)
            this.isC2c = this.selectedCandidate.c2C;
            this.isRelocate = this.selectedCandidate.relocate;
            this.isWorkedWithClient = this.selectedCandidate.workedWithClient;
            this.isEmployerDetails = false;
            this.isCandidate = true;
            this.isNewCandidate = false;
            this.selectedSkills = this.selectedCandidate.skills;
            // this.selectedSkillsText = this.selectedCandidate.skills.name.join()
            // console.log(this.selectedSkillsText)
            const immigirationStatus = this.selectedCandidate.visaStatus;
            for (const immigration of this.immigration) {
              immigration.isChecked = false;
            }
            for (const immigration of this.immigration) {
              if (_.isEqual(immigirationStatus.visaStatusId, immigration.visaStatusId)) {
                immigration.isChecked = true;
              }
            }
          } else {
            this.isCandidate = false;
            this.isNewCandidate = true;
            this.selectedSkills = [];
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

  getWorkedWithClient(event) {
    if (event.value === 'true') {
      this.isWorkedWithClient = true;
    } else {
      this.isWorkedWithClient = false;
    }
  }

  getImmigiration(event) {
    if (event !== undefined) {
      this.immigirationStatus = { visaStatusId: event };
    }
  }

  relocate(event) {
    if (event.value === 'true') {
      this.isRelocate = true;
    } else {
      this.isRelocate = false;
    }
  }

  openFiles(media) {
    window.open(this.baseUrl + media.mediaThumbnailPath, '_blank');
  }


  addNewSubmission(form: FormGroup) {

    if (form.value.buyingRate === '' || form.value.buyingRate === null) {
      this.toastr.error('Buying Rate should not be empty', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }
    this.ngProgress.start();

    if (this.isNewCandidate) {
      this.createNewCandidate(form);
    } else {
      this.SubmissionWithCandidate(form, this.selectedCandidate.candidateId);
    }

  }

  SubmissionWithCandidate(form: FormGroup, candidateId: any) {

    const submission = {
      requirementId: parseInt(form.value.requirements),
      accountName: form.value.accountName,
      clientRate: form.value.clientRate,
      buyingRate: form.value.buyingRate,
      sellingRate: form.value.sellingRate,
      // status: form.value.status,
      clientContactname: form.value.clientContactname,
      clientContactEmail: form.value.clientContactEmail,
      workLocation: form.value.workLocation,
      enteredBy: this.rtsUserId,
      candidateId: parseInt(candidateId)
    };

    this.submissionService.addSubmission(submission)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
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
      skills: this.selectedSkills,
      enteredBy: parseInt(this.rtsUserId)
    };

    if (this.isWorkedWithClient) {
      candidate.workedWithClient = true;
      candidate.workedClient = form.value.workedClient;
    } else {
      candidate.workedWithClient = false;
      candidate.workedClient = '';
    }

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
        technologyId: parseInt(form.value.editTechnology)
      }];
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
                  this.toastr.success('New Candidate Successfully added', '', {
                    positionClass: 'toast-top-center',
                    timeOut: 3000,
                  });
                  this.SubmissionWithCandidate(form, data.candidate.candidateId);
                } else {
                  this.toastr.error(file.message, '', {
                    positionClass: 'toast-top-center',
                    timeOut: 3000,
                  });
                  this.SubmissionWithCandidate(form, data.candidate.candidateId);
                }
              });
          } else {
            this.toastr.success('New Candidate Successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.SubmissionWithCandidate(form, data.candidate.candidateId);
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

}
