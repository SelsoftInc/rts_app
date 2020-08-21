import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { CandidateService } from '../Services/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { ApiUrl } from 'src/app/Services/api-url';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.css'],
  providers: [LoggedUserService]
})
export class EditCandidateComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;
  private rtsCompanyId: any;

  public myForm: FormGroup;
  private technologies: any;
  private files: any;
  private getFiles: any;
  private isOtherTechnology: boolean;
  private isEmployerDetails: boolean;
  private candidateId: any;
  private candidates: any;
  private selectedCandidate: any;
  private deletedMediaFiles: any[];
  private immigirationStatus: any;
  private baseUrl: any;
  private isRelocate: boolean;
  private isWorkedWithClient: boolean;
  private immigration: any;
  private selectedSkills: any;
  addCustomSkills = (skill) => ({ skillId: skill, name: skill });
  skills: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.deletedMediaFiles = [];
    this.isEmployerDetails = false;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.candidateId = params['id'];
      });

    this.baseUrl = ApiUrl.BaseUrl;

    this.myForm = this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      // tslint:disable-next-line:max-line-length
      phoneNumber: ['', [Validators.maxLength(15), Validators.pattern('^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$')]],
      location: [''],
      availability: [''],
      immigirationStatus: [''],
      technologies: [''],
      skype: [''],
      linkedIn: [''],
      otherTechnology: [''],
      employerName: [''],
      employerContactName: [''],
      employerPhone: [''],
      employerEmail: [''],
      c2c: [''],
      relocate: [''],
      interview: [''],
      experience: [''],
      totalExperience: [''],
      resonForChange: [''],
      epNumber: [''],
      authorizedWorkInUs: [''],
      workedClient: [''],
      anotherInterviewOffer: [''],
      vacationPlans: [''],
      currentCompany: [''],
      workedWithClient: [''],
      enteredUser: [''],
      createdDate: [''],
      locationPreferences: [''],
      workedAsFullTime: [''],
      graduationYear: [''],
      educationCredentials: [''],
      dateOfBirth: [''],
      currentProject: [''],
      totalUsExperience: [''],
      skills: [''],
      skillsExperience: this.formBuilder.array([
        this.initSkills()
      ]),
    });
    this.getCommonDetails();
    this.getAllSkills();
    // this.getCandidateById();
  }

  initSkills() {
    return this.formBuilder.group({
      name: [''],
      expYear: [''],
      skillId: ['']
    });
  }

  addSkill() {
    const control = <FormArray>this.myForm.controls['skillsExperience'];
    control.push(this.initSkills());
  }
  removeSkill(i: number) {
    const control = <FormArray>this.myForm.controls['skillsExperience'];
    control.removeAt(i);
  }


  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.technologies = data.technologies;
            this.immigration = data.visaStatus;
            for (const immigration of this.immigration) {
              immigration.isChecked = false;
            }
            this.getCandidateById();
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

  getCandidateById() {
    const candidateId = {
      candidateId: parseInt(this.candidateId)
    };

    this.candidateService.getCandidateById(candidateId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.selectedCandidate = data.candidate;
            this.isRelocate = this.selectedCandidate.relocate;
            this.isWorkedWithClient = this.selectedCandidate.workedWithClient;
            this.isEmployerDetails = this.selectedCandidate.c2C;
            this.selectedSkills = this.selectedCandidate.skills;
            const immigirationStatus = this.selectedCandidate.visaStatus;
            for (const immigration of this.immigration) {
              if (_.isEqual(immigirationStatus.visaStatusId, immigration.visaStatusId)) {
                immigration.isChecked = true;
              }
            }
            for (const skill of this.selectedSkills) {
              if (!skill.expYear) {
                skill.expYear = '';
              }
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
            this.immigirationStatus = { visaStatusId: immigirationStatus.visaStatusId };
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
    this.deletedMediaFiles.push(media.mediaFileId);
    const clear = this.selectedCandidate.mediaFiles.indexOf(media);
    this.selectedCandidate.mediaFiles.splice(clear, 1);
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
    if (event.value === 'true') {
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

  relocate(event) {
    if (event.value === 'true') {
      this.isRelocate = true;
    } else {
      this.isRelocate = false;
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

  updateCandidate(form: FormGroup) {
    this.ngProgress.start();

    const candidate: any = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      location: form.value.location,
      availability: form.value.availability,
      visaStatus: this.immigirationStatus,
      companyId: this.rtsCompanyId,
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
      vacationPlan: form.value.vacationPlans,
      candidateId: parseInt(this.candidateId),
      locationPreferences: form.value.locationPreferences,
      workedAsFullTime: form.value.workedAsFullTime,
      graduationYear: form.value.graduationYear,
      educationCredentials: form.value.educationCredentials,
      dateOfBirth: form.value.dateOfBirth,
      currentProject: form.value.currentProject,
      totalUsExperience: form.value.totalUsExperience,
      skills: form.value.skillsExperience,
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
    } else {
      candidate.c2C = false;
      candidate.employeeName = '';
      candidate.employeeContactName = '';
      candidate.employeeContactPhone = '';
      candidate.employeeContactEmail = '';
    }

    if (form.value.technologies === 'other') {
      candidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      candidate.technology = [{
        technologyId: parseInt(form.value.technologies)
      }];
    }

    const updateCandidate = {
      candidate: candidate,
      deletedMediaFiles: this.deletedMediaFiles
    };

    this.candidateService.editCandidate(updateCandidate)
      .subscribe(
        data => {
          if (data.success) {

            if (this.getFiles.length > 0) {
              const upload = {
                file: this.getFiles,
                candidateId: this.candidateId,
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
            this.ngProgress.done();
            this.toastr.success('Updated Successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['search-candidates']);

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
