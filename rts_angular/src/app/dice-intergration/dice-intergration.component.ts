import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { NgProgress } from 'ngx-progressbar';
import * as moment from 'moment';
import { PageEvent } from '@angular/material';
import { DiceService } from '../Services/dice.service';
import { RequirementsService } from '../Services/requirements.service';

@Component({
    selector: 'app-dice-intergration',
    templateUrl: './dice-intergration.component.html',
    styleUrls: ['./dice-intergration.component.css'],
    providers: [LoggedUserService]
})
export class DiceIntergrationComponent implements OnInit {

    // lowValue: number = 0;
    // highValue: number = 10;
    public myForm: FormGroup;
    public candidateForm: FormGroup;
    rtsUser: any;
    rtsUserId: any;
    rtsCompanyId: any;
    candidates: any;
    candidatesLength: any;
    userRole: any;
    diceAccount: any;
    selectedDice: any;
    contactMethod: any[];
    selectedSkills: string;
    selected: string;
    skills: any;
    educationDegree: { "name": string; "value": string; }[];
    diceCandidates: any;
    searchType: any;
    sortBy: string;
    workPermit: any[];
    selectedWorkPermit: any;
    distanceUnit: string;
    selectedEducationDegree: any[];
    employmentType: { "name": string; "value": string; }[];
    selectedEmploymentType: any[];
    selectedQuery: string;
    selectedLocation: string;
    pageNumber: number = 1;
    pageSize: number;
    filterForm: FormGroup;
    isFilterAction: boolean;
    diceMetaDataCount: number;
    loading: boolean;
    sortByDirection: string;
    rtsDiceId: any;

    constructor(
        private loggedUser: LoggedUserService,
        private requirementService: RequirementsService,
        private formBuilder: FormBuilder,
        private ngProgress: NgProgress,
        private toastr: ToastrService,
        private diceService: DiceService
    ) {
        this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
        this.rtsUserId = this.rtsUser.userId;
        this.userRole = this.rtsUser.role;
        this.rtsCompanyId = this.rtsUser.companyId;
        this.rtsDiceId = this.rtsUser.diceId;
        this.candidates = [];
        this.skills = [];
        this.selectedWorkPermit = [];
        this.selectedEmploymentType = [];
        this.selectedEducationDegree = [];
        this.diceCandidates = {};
        this.pageSize = 25;
        this.diceMetaDataCount = 0;
        this.isFilterAction = false;
        this.loading = false;
    }

    ngOnInit() {
        // this.ngProgress.start();

        this.myForm = this.formBuilder.group({
            query: [''],
            location: ['']
        })
        this.candidateForm = this.formBuilder.group({
            distance: [''],
            distanceUnit: [''],
            lastActive: [''],
            hasEmail: [''],
            hasPhone: [''],
            relocate: [''],
            skillsKeyword: [''],
            experience: [''],
            employmentType: [''],
            education: [''],
            workPermit: [''],
            pageSize: [''],
            jobTitle: [''],
            sortBy: [''],
            searchType: [''],
            language: [''],
            socialProfile: [''],
            sortByDirection: [''],
            excludeThirdParty: ['']
        })
        this.getAllDiceAccount();
        this.contactMethod = [{ "name": "Email", "value": true }, { "name": "Phone", "value": true }];
        this.searchType = "Integrated";
        this.sortBy = "relevancy";
        this.distanceUnit = 'miles';
        this.sortByDirection = "desc";
        this.workPermit = [
            { "name": " US Citizenship", "value": "us citizenship" },
            { "name": "Green Card", "value": "green card" },
            { "name": "Employment Auth Document", "value": "employment auth document" },
            { "name": "Have H1", "value": "have h1" },
            { "name": "Need H1", "value": "need h1" },
            { "name": "Have J1", "value": "have j1" },
            { "name": "TN Permit Holder", "value": "tn permit holder" },
        ]
        this.educationDegree = [
            { "name": "Bechelors", "value": "bachelors" },
            { "name": "Masters", "value": "masters" },
            { "name": "MBA", "value": "mba" },
            { "name": "Associate", "value": "associate" },
            { "name": "High School", "value": "high school" },
            { "name": "Vocational School", "value": "vocational school" },
            { "name": "Military Service", "value": "military service" }];
        this.employmentType = [
            { "name": "Full time", "value": "full-time" },
            { "name": "Contract - W2", "value": "contract - w2" },
            { "name": "Contract to Hire -W2", "value": "contract to hire - w2" },
            { "name": "Contract to Hire - Independent", "value": "ccontract to hire - independent" },
            { "name": "Contract - Independent", "value": "contract - independent" },
            { "name": "Part Time", "value": "part-  time" },
            { "name": "Contract to Hire - Corp-to-Crop", "value": "contract to hire - corp-to-corp" },
            { "name": "Contract - Crop-to-Crop", "value": "contract - corp-to-corp" },
            { "name": "1099 Employee", "value": "1099 employee" },
            { "name": "Announced", "value": "announced" },
            { "name": "Crop-to-Crop", "value": "corp-to-corp" },
            { "name": "EB-1", "value": "eb-1" },
            { "name": "Eb-2", "value": "eb-2" },
            { "name": "Eb-3", "value": "eb-3" },
            { "name": "H1B", "value": "h-1b" },
            { "name": "H4", "value": "h-4" },
            { "name": "Independent", "value": "independent" },
            { "name": "J1", "value": "j-1" },
            { "name": "J2", "value": "j-2" },
            { "name": "Tax Term", "value": "tax term" },
            { "name": "W2", "value": "w-2" },
            { "name": "W2/1099", "value": "w-2 / 1099" }];
    }

    getAllDiceAccount() {
        const companyId = {
            companyId: this.rtsCompanyId
        };

        this.diceService.getAllDice(companyId)
            .subscribe(
                data => {
                    if (data.success) {
                        this.diceAccount = data.diceInfo;
                    }
                });
    }

    setDiceAccount() {
        const submit = {
            userId: this.rtsUserId,
            diceId: this.rtsDiceId
        };

        this.diceService.setDefaultDice(submit)
            .subscribe(
                data => {
                    if (data.success) {
                        this.toastr.success(data.message, '', {
                            positionClass: 'toast-top-center',
                            timeOut: 3000,
                        });
                    } else {
                        this.toastr.error(data.message, '', {
                            positionClass: 'toast-top-center',
                            timeOut: 3000,
                        });
                    }
                });
    }


    public getPaginatorData(event: PageEvent): PageEvent {
        this.loading = true;
        this.pageNumber = 1 + event.pageIndex;
        this.pageSize = event.pageSize;
        if (this.isFilterAction) {
            this.filterFunction(this.filterForm)
        } else {
            const submit = {
                userId: this.rtsUserId,
                q: this.selectedQuery,
                page: this.pageNumber + event.pageIndex,
                pageSize: event.pageSize,
                location: this.selectedLocation,
                sortByDirection: this.sortByDirection,
            };
            this.diceService.diceFilterSearch(submit)
                .subscribe(
                    data => {
                        this.ngProgress.done();
                        this.loading = false;
                        if (data.success) {
                            this.candidates = data.diceCandidate.data;
                            this.diceMetaDataCount = data.diceCandidate.meta.totalCount;
                            this.candidatesLength = this.candidates.length;
                        } else {
                            this.toastr.error(data.message, '', {
                                positionClass: 'toast-top-center',
                                timeOut: 3000,
                            });
                        }
                    });
        }
        return event;
    }


    getCandidates(form: FormGroup) {
        this.loading = true;
        if (this.isFilterAction) {
            this.filterFunction(this.filterForm);
        } else {

            const submit = {
                userId: this.rtsUserId,
                q: form.value.query,
                location: form.value.location,
                page: this.pageNumber,
                sortByDirection: this.sortByDirection,
            };
            this.diceService.diceSearch(submit)
                .subscribe(
                    data => {
                        this.ngProgress.done();
                        this.loading = false;
                        if (data.success) {
                            this.candidates = data.diceCandidate.data;
                            this.diceMetaDataCount = data.diceCandidate.meta.totalCount;
                            this.candidatesLength = this.candidates.length;
                        } else {
                            this.toastr.error(data.message, '', {
                                positionClass: 'toast-top-center',
                                timeOut: 3000,
                            });
                        }
                    });
        }
    }

    candidateFilter(form: FormGroup) {
        this.loading = true;
        this.isFilterAction = true;
        this.filterForm = form;
        this.filterFunction(this.filterForm)
    }

    filterFunction(form) {
        const educationDegree = this.selectedEducationDegree.map(x => x).join(",");
        const workPermit = this.selectedWorkPermit.map(x => x).join(",");
        const employmentType = this.selectedEmploymentType.map(x => x).join(",");

        const submit = {
            userId: this.rtsUserId,
            q: this.selectedQuery,
            location: this.selectedLocation,
            sortBy: this.sortBy,
            searchType: this.searchType,
            page: this.pageNumber,
            pageSize: this.pageSize,
            skillsKeyword: form.value.skillsKeyword,
            sortByDirection: this.sortByDirection,
            distance: parseInt(form.value.distance),
            distanceUnit: form.value.distanceUnit,
            lastActive: parseInt(form.value.lastActive),
            jobTitle: form.value.jobTitle,
            willingToRelocate: form.value.relocate,
            hasEmail: form.value.hasEmail,
            hasPhone: form.value.hasPhone,
            yearsOfExperience: form.value.experience,
            workPermit: workPermit,
            educationDegree: educationDegree,
            employmentType: employmentType,
            language: form.value.language,
            socialProfiles: form.value.socialProfile,
            excludeThirdParty: form.value.excludeThirdParty
        };
        
        this.diceService.diceFilterSearch(submit)
            .subscribe(
                data => {
                    this.ngProgress.done();
                    this.loading = false;
                    if (data.success) {
                        this.candidates = data.diceCandidate.data;
                        this.diceMetaDataCount = data.diceCandidate.meta.totalCount;
                        this.candidatesLength = this.candidates.length;
                    } else {
                        this.toastr.error(data.message, '', {
                            positionClass: 'toast-top-center',
                            timeOut: 3000,
                        });
                    }
                });
    }

    resetForm() {
        this.candidateForm.reset();
    }

}
