import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { CandidateService } from '../Services/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';

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
  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
    this.deletedMediaFiles = [];
  }

  ngOnInit() {

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.candidateId = params['id'];
      });

    this.myForm = this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      phoneNumber: [''],
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
      c2c: ['']
    });
    this.getCommonDetails();
    this.getAllCandidates();
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
          }
        });
  }

  getAllCandidates() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.candidateService.allCandidate(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.candidates = data.candidates;
            for (const user of this.candidates) {
              this.selectedCandidate = _.findWhere(this.candidates, { candidateId: this.candidateId });
              if (this.selectedCandidate.c2C) {
                this.myForm.controls.c2c.setValue('Yes');
                this.isEmployerDetails = true;
              }
              const immigiration = this.selectedCandidate.immigirationStatus;
              if (immigiration === 'GC') {
                this.myForm.controls.immigirationStatus.setValue('GC');
              } else if (immigiration === 'CITIZEN') {
                this.myForm.controls.immigirationStatus.setValue('CITIZEN');
              } else if (immigiration === 'H1B') {
                this.myForm.controls.immigirationStatus.setValue('H1B');
              } else if (immigiration === 'W2/1099') {
                this.myForm.controls.immigirationStatus.setValue('W2/1099');
              } else if (immigiration === 'OPT/CPT') {
                this.myForm.controls.immigirationStatus.setValue('OPT/CPT');
              } else if (immigiration === 'EAD') {
                this.myForm.controls.immigirationStatus.setValue('EAD');
              } else if (immigiration === 'H4AD') {
                this.myForm.controls.immigirationStatus.setValue('H4AD');
              }
            }
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

  updateCandidate(form: FormGroup) {

    const candidate: any = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      location: form.value.location,
      availability: form.value.availability,
      immigirationStatus: this.immigirationStatus,
      companyId: this.rtsCompanyId,
      skype: form.value.skype,
      linkedIn: form.value.linkedIn,
      enteredBy: this.rtsUserId,
      candidateId: this.candidateId
    };

    if (form.value.technologies === 'other') {
      candidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      candidate.technology = [{
        technologyId: form.value.technologies
      }];
    }

    const updateCandidate = {
      candidate: candidate,
      deletedMediaFiles: this.deletedMediaFiles
    };

    this.candidateService.editCandidate(updateCandidate)
      .subscribe(
        data => {
          console.log(data);
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

            this.toastr.success('Updated Successfully', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['manage-candidate']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });
  }

}
