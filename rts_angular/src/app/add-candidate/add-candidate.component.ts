import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RequirementsService } from '../Services/requirements.service';
import { CandidateService } from '../Services/candidate.service';

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
  constructor(
    private loggedUser: LoggedUserService,
    private requirementService: RequirementsService,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.getFiles = [];
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      location: ['', Validators.required],
      availability: ['', Validators.required],
      immigirationStatus: ['', Validators.required],
      technologies: [''],
      skype: [''],
      linkedIn: [''],
      otherTechnology: ['']
    });
    this.getCommonDetails();
  }

  getCommonDetails() {
    const companyId = {
      companyId: this.rtsCompanyId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.technologies = data.technologies;
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
      this.isOtherTechnology = false;
    }
  }

  addNewCandidate(form: FormGroup) {

    const newCandidate: any = {
      name: form.value.name,
      email: form.value.email,
      phoneNumber: form.value.phoneNumber,
      location: form.value.location,
      availability: form.value.availability,
      immigirationStatus: form.value.immigirationStatus,
      companyId: this.rtsCompanyId,
      skype: form.value.skype,
      linkedIn: form.value.linkedIn
    };

    if (form.value.technologies === 'other') {
      newCandidate.technology = [{
        technologyName: form.value.otherTechnology
      }];
    } else {
      newCandidate.technology = [{
        technologyId: form.value.technologies
      }];
    }
    console.log(newCandidate);

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
              console.log(upload);
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
