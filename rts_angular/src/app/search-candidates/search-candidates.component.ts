import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { NgProgress } from 'ngx-progressbar';
import * as _ from 'underscore';
import { RequirementsService } from '../Services/requirements.service';
import { SendMailComponent } from '../send-mail/send-mail.component';
import { Router } from '@angular/router';
import { CandidateService } from '../Services/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RemoveBulkEmailComponent } from '../remove-bulk-email/remove-bulk-email.component';

export interface DialogData {
  mailTo: any;
  diceMail: any;
}


@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: ['./search-candidates.component.css'],
  providers: [LoggedUserService]
})
export class SearchCandidatesComponent implements OnInit {

  public myForm: FormGroup;
  selectedSkills: any[];
  selectedCandidates: any[];
  rtsUserId: any;
  technologies: any;
  rtsUser: any;
  candidateLength: number;
  rtsCompanyId: any;  
  skills: any;
  boldedText: any;
  userRole: any;
  ANDSkills: any[];
  ORSkills: any[];
  addCustom = (item) => ({ name: item });
  skill: any;
  localCandidates: any;
  diceCandidates: any;
  localCandidateLength: any;
  lowValue: number = 0;
  highValue: number = 20;
  diceCandidateLength: any;
  selectedQuery: string;
  selectedLocation: any[];
  location: any[];
  immigration: any[];;
  selectedVisaStatus: any[];
  workPermit: any[];
  selectedWorkPermit: any[];

  public static ANDSkill: any;
  public static ORSkill:any;
  public static location:any;
  public static workPermit:any;
  public static visaStatus:any;

  constructor(
    private requirementService: RequirementsService,
    private candidateService: CandidateService,
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ngProgress: NgProgress,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.rtsCompanyId = this.rtsUser.companyId;
    this.userRole = this.rtsUser.role;
    this.selectedSkills = [];
    this.ANDSkills = [];
    this.ORSkills = [];
    this.boldedText = [];
    this.selectedLocation = [];
    this.location = [];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllSkills();
    this.getCommonDetails();
    this.workPermit = [
      { "name": " US Citizenship", "value": "us citizenship" },
      { "name": "Green Card", "value": "green card" },
      { "name": "Employment Auth Document", "value": "employment auth document" },
      { "name": "Have H1", "value": "have h1" },
      { "name": "Need H1", "value": "need h1" },
      // { "name": "Have J1", "value": "have j1" },
      { "name": "Canadian Citizen", "value": "canadian citizen" },
      { "name": "TN Permit Holder", "value": "tn permit holder" },
    ]
    if (SearchCandidatesComponent.ANDSkill !== undefined) {
     this.ANDSkills = SearchCandidatesComponent.ANDSkill;
     this.ORSkills = SearchCandidatesComponent.ORSkill;
     this.selectedLocation = SearchCandidatesComponent.location;
     this.selectedWorkPermit = SearchCandidatesComponent.workPermit;
     this.selectedVisaStatus = SearchCandidatesComponent.visaStatus;
      this.getTech();
    }

  }

  getCommonDetails() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.requirementService.commonDetails(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.immigration = data.visaStatus;
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
          this.ngProgress.done();
          if (data.success) {
            this.skills = data.skills;
            this.skill = data.skills;
          }
        });
  }

  public getLocalPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }
  public getDicePaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  getTech() {
    SearchCandidatesComponent.ANDSkill = this.ANDSkills;
    SearchCandidatesComponent.ORSkill = this.ORSkills;
    SearchCandidatesComponent.location = this.selectedLocation;
    SearchCandidatesComponent.workPermit = this.selectedWorkPermit;
    SearchCandidatesComponent.visaStatus = this.selectedVisaStatus;

    if (this.ANDSkills.length > 0 || this.ORSkills.length > 0) {
      this.ngProgress.start();

      var selectedAND = [];
      var selectedOR = [];
      var skills = [];
      var location = [];
      for (const skill of this.ANDSkills) {
        selectedAND.push(skill.name);
        skills.push(skill.name);
      }
      for (const skill of this.ORSkills) {
        selectedOR.push(skill.name);
        skills.push(skill.name);
      }
      for (const local of this.selectedLocation) {
        location.push(local.name.toLowerCase());
      }
      this.selectedQuery = skills.toString();
      const submit = {
        userId: this.rtsUserId,
        skill: {
          and: selectedAND,
          or: selectedOR,
          location: location,
          workPermit: this.selectedWorkPermit
        },
        visaStatus: this.selectedVisaStatus
      }

      this.candidateService.getCandidateByTechnology(submit)
        .subscribe(
          data => {
            this.ngProgress.done();
            if (data.success) {
              this.localCandidates = data.candidates;
              this.diceCandidates = data.diceCandidates;
              this.localCandidateLength = this.localCandidates.length;
              this.diceCandidateLength = this.diceCandidates.length;
            } else {
              this.toastr.error(data.message, '', {
                positionClass: 'toast-top-center',
                timeOut: 3000,

              });
            }
          });
    }
  }

  removeEmail() {
    const dialogRef = this.dialog.open(RemoveBulkEmailComponent, {
      height: '400px',
      width: '800px',
      data: {}
    });
  }

  sendMail() {
    const dialogRef = this.dialog.open(SendMailComponent, {
      height: '800px',
      width: '1200px',
      data: { mailTo: this.localCandidates, diceMail: this.diceCandidates }
    });

  }

}
