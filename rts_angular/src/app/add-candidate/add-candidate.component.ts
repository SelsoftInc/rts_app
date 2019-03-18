import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import { CandidateService } from '../Services/candidate.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css'],
  providers: [LoggedUserService]
})
export class AddCandidateComponent implements OnInit {

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
  private immigirationStatus: any;
  private isRelocate: boolean;
  private isWorkedWithClient: boolean;
  immigration: any;

  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private router: Router,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.isRelocate = true;
    this.isWorkedWithClient = false;
  }

  ngOnInit() {
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
      relocate: [''],
      interview: [''],
      experience: [''],
      resonForChange: [''],
      linkedIn: [''],
      otherTechnology: [''],
      employerName: [''],
      employerContactName: [''],
      employerPhone: [''],
      employerEmail: [''],
      totalExperience: [''],
      epNumber: [''],
      authorizedWorkInUs: [''],
      workedClient: [''],
      anotherInterviewOffer: [''],
      vacationPlans: [''],
      currentCompany: [''],
      locationPreferences:[''],
      workedAsFullTime:[''],
      graduationYear:[''],
      educationCredentials:[''],
      dateOfBirth:[''],
      currentProject:[''],
      totalUsExperience:[''],

    });
    this.getCommonDetails();
    // this.myForm.controls.immigirationStatus.setValue('GC');
    // this.immigirationStatus = 'GC';
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

  relocate(event) {
    if (event.value === 'true') {
      this.isRelocate = true;
    } else {
      this.isRelocate = false;
    }
  }

  getImmigiration(event) {
    if (event !== undefined) {
      this.immigirationStatus = { visaId: event };
    }
  }

  addNewCandidate(form: FormGroup) {
    this.ngProgress.start();

    const newCandidate: any = {
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
      locationPreferences: form.value.locationPreferences,
      workedAsFullTime: form.value.workedAsFullTime,
      graduationYear: form.value.graduationYear,
      educationCredentials: form.value.educationCredentials,
      dateOfBirth: form.value.dateOfBirth,
      currentProject: form.value.currentProject,
      totalUsExperience: form.value.totalUsExperience,
      enteredBy: {
        userId: this.rtsUserId
      }
    };

    if (this.isWorkedWithClient) {
      newCandidate.workedWithClient = true;
      newCandidate.workedClient = form.value.workedClient;
    } else {
      newCandidate.workedWithClient = false;
      newCandidate.workedClient = '';
    }

    if (this.isEmployerDetails) {
      newCandidate.c2C = true;
      newCandidate.employeeName = form.value.employerName;
      newCandidate.employeeContactName = form.value.employerContactName;
      newCandidate.employeeContactPhone = form.value.employerPhone;
      newCandidate.employeeContactEmail = form.value.employerEmail;
    }

    if (form.value.technologies === 'other') {
      newCandidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      newCandidate.technology = [{
        technologyId: form.value.technologies
      }];
    }

    this.candidateService.addCandidate(newCandidate)
      .subscribe(
        data => {
          if (data.success) {

            if (this.getFiles.length > 0) {
              const upload = {
                file: this.getFiles,
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
            this.ngProgress.done();
            this.router.navigate(['manage-candidate']);

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
