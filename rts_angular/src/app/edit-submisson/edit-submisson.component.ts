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
    private mailFormat: any;
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
    private immigration: any;
    private clientCC: any;
    private clientCcArray: any;
    isSelected: boolean;
    joinDate: Date;
    clients: any;
    selectedClient: any;
    submissionStatus: any;
    statusObj: any;
    skills: any;
    selectedSkills: any;
    selectedSkillsText: any;
    addCustomSkills = (skill) => ({ skillId: 0, name: skill });

    // submissionComment: any;

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
        this.isSelected = false;
        this.recruiterName = [];
        this.adminUsersArray = [];
        this.clientCcArray = [];
        this.recruiterEmail = [];
        this.getFiles = [];
        this.clientCC = [];
        this.allRequirements = [];
        this.candidateGetFiles = [];
        this.deletedMediaFiles = [];
        this.dropdownSettings = {};
        this.adminUsers = [];
        this.customMailBody = '';
        this.selectedAdmins = [];
        this.submissionStatus = [];
        this.clients = [];
        this.isC2c = false;
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
            interviewComments: [''],
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
            clientCcRecruiters: [''],
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
            note:[''],
            units: this.formBuilder.array([
                this.initUnits()
            ]),
        });

        this.isNewCandidate = false;
        this.getAllCommonData();
        this.getAllSkills();
        this.getAllUser();
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
                    this.clients = data.clients;
                    this.technology = data.technologies;
                    this.immigration = data.visaStatus;
                    this.submissionStatus = data.userSubmissionStatus;
                    for (const immigration of this.immigration) {
                        immigration.isChecked = false;
                    }
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
                        // this.editSubmission();
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
                        // this.editSubmission();
                    }
                });
    }

    getRequirement(event) {
        this.recruiterName = [];
        this.recruiterEmail = [];
        this.selectedRequirement = _.findWhere(this.allRequirements, { requirementId: event });
        for (const recruiter of this.selectedRequirement.toClientRecuriters) {
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
                        this.isC2c = this.selectedSubmission.candidate.c2C
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
                        const immigirationStatus = this.selectedSubmission.candidate.visaStatus;
                        for (const immigration of this.immigration) {
                            if (_.isEqual(immigirationStatus.visaStatusId, immigration.visaStatusId)) {
                                immigration.isChecked = true;
                            }
                        }
                        this.addCandidate = false;
                        this.isNewCandidate = false;
                    } else {
                        this.isWorkedWithClient = false;
                        this.selectedSkills = [];
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
            submissionId: parseInt(this.submissionId),
        };

        this.submissionService.getRequirementBySubmission(submit)
            .subscribe(
                data => {
                    if (data.success) {
                        this.selectedRequirement = data.requirement;
                        this.allRequirements.push(this.selectedRequirement);
                        const submission = _.findWhere(this.selectedRequirement.submissions, { submissionId: parseInt(this.submissionId) });
                        this.ngProgress.done();
                        if (submission !== undefined) {
                            this.selectedSubmission = submission;
                        }
                        // console.log(this.selectedSubmission)
                        this.selectedClient = _.findWhere(this.clients, { clientId: parseInt(this.selectedRequirement.client.clientId) });
                        this.status = this.selectedSubmission.submissionStatus.statusId;
                        this.statusObj = this.selectedSubmission.submissionStatus;
                        const ccRecruiters = this.selectedClient.ccRecruitersJSON;
                        this.isC2c = this.selectedSubmission.candidate.c2C;
                        this.isRelocate = this.selectedSubmission.candidate.relocate;
                        this.isWorkedWithClient = this.selectedSubmission.candidate.workedWithClient;
                        this.selectedSkills = this.selectedSubmission.candidate.skills;
                        var skillText = [];
                        for (const skill of this.selectedSkills) {
                            skillText.push(skill.name + ' ');
                        }
                        this.selectedSkillsText = skillText.join();
                        const isStatusExiting = _.findIndex(this.submissionStatus, this.statusObj)
                        if (isStatusExiting === -1) {
                            this.submissionStatus.push(this.statusObj);
                        }
                        for (const ccUser of ccRecruiters) {
                            this.clientCC.push({ email: ccUser.email, firstName: ccUser.name });
                        }
                        if (this.selectedSubmission.interviewDetails.length > 0) {
                            this.removeUnits(0);
                        }
                        const control = <FormArray>this.myForm.controls['units'];
                        for (const interviews of this.selectedSubmission.interviewDetails) {
                            control.push(this.formBuilder.group(interviews));
                        }
                        // tslint:disable-next-line:max-line-length
                        if (this.status === 5 || this.status === 4 || this.status === 7 || this.status === 11 || this.status === 14) {
                            this.isRejected = true;
                        }
                        if (this.status === 2 || this.status === 3) {
                            this.isSubmitted = true;
                        } else {
                            this.isSubmitted = false;
                        }
                        if (this.selectedSubmission.interviewDetailStatus === 'SELECTED') {
                            this.isSelected = true;
                            this.joinDate = moment(this.selectedSubmission.joiningDateStr, 'YYYY-MM-DD').toDate();
                        } else {
                            this.isSelected = false;
                        }
                        for (const recruiter of this.selectedRequirement.toClientRecruiters) {
                            this.recruiterName.push(recruiter.name + ' ');
                            this.recruiterEmail.push(recruiter.email + ' ');
                        }
                        this.clientRecruiterName = this.recruiterName.join();
                        this.clientRecruiterEmail = this.recruiterEmail.join();

                        const immigirationStatus = this.selectedSubmission.candidate.visaStatus;
                        for (const visaStatus of this.immigration) {
                            if (_.isEqual(immigirationStatus.visaStatusId, visaStatus.visaStatusId)) {
                                visaStatus.isChecked = true;
                            }
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
        for (const client of this.clientCcArray) {
            this.selectedAdmins.push(client.email);
        }

        const submit = {
            submissionId: parseInt(this.submissionId),
            submittedUserId: this.rtsUserId,
            mailFormat: this.mailFormat,
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
        if (event.value === '1') {
            this.mailFormat = 1;
        } else if (event.value === '2') {
            this.mailFormat = 2;
        } else if (event.value === '3') {
            this.mailFormat = 3;
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
        this.deletedMediaFiles.push(media.mediaFileId);
        const clear = this.selectedSubmission.mediaFiles.indexOf(media);
        this.selectedSubmission.mediaFiles.splice(clear, 1);
    }

    changeStatus(event) {
        console.log(event)
        const statusId = parseInt(event);
        if (statusId === 5 || statusId === 4 || statusId === 7 || statusId === 11 || statusId === 14) {
            this.isRejected = true;
        } else {
            this.isRejected = false;
        }
    }

    changeInterviewStatus(event) {
        if (event === 'SELECTED') {
            this.isSelected = true;
        } else {
            this.isSelected = false;
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
        if (event.value === 'true') {
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
                            // this.submissionComment = this.comment;
                            // console.log(this.submissionComment)
                            this.comment = '';
                        }
                    });
        }
    }

    updateSubmission(form: FormGroup) {
        this.ngProgress.start();
        this.sendToClient = false;
        if (this.isNewCandidate) {
            this.createNewCandidate(form);
        } else {
            this.updateCandidateWithSubmission(form, this.selectedSubmission.candidate.candidateId);
        }
    }

    updateCandidateWithSubmission(form: FormGroup, candidateId: any) {

        // if (this.comment !== '' || this.comment !== undefined) {
        //     this.selectedSubmission.comments.push({ comment: this.comment, enteredBy: this.rtsUserId });
        //     console.log(this.submissionComment)
        //     console.log(this.selectedSubmission.comments)
        // }


        const submission: any = {
            requirementId: parseInt(form.value.requirements),
            location: form.value.location,
            accountName: form.value.accountName,
            clientRate: form.value.clientRate,
            sellingRate: form.value.sellingRate,
            buyingRate: form.value.buyingRate,
            clientContactname: form.value.clientContactname,
            clientContactEmail: form.value.clientContactEmail,
            workLocation: form.value.workLocation,
            reasonForRejection: form.value.reasonForRejection,
            interviewStatus: form.value.interviewComments,
            interviewDetailStatus: form.value.interviewStatus,
            currentStatus: form.value.currentStatus,
            enteredBy: this.rtsUserId,
            submissionId: parseInt(this.submissionId),
            candidateId: candidateId,
            approvalUserId: this.rtsUserId,
            interviewDetails: form.value.units,
            joiningDateStr: form.value.joiningDate,
            comments: this.selectedSubmission.comments,
            note: form.value.note,
        };

        if (this.sendToClient) {
            submission.statusId = 3;
            submission.isApprovedByAdmin = true;
        } else {
            submission.statusId = parseInt(form.value.status);
        }


        if (this.sendToClient) {
            if (this.mailFormat === undefined) {
                this.toastr.error('Please Select the Mail Format', '', {
                    positionClass: 'toast-top-center',
                    timeOut: 3000,
                });
                this.ngProgress.done();
                return false;
            }

            if (this.isCustomBody === undefined || this.isDefaultBody === undefined) {
                this.toastr.error('Please Select the Mail Body', '', {
                    positionClass: 'toast-top-center',
                    timeOut: 3000,
                });
                this.ngProgress.done();
                return false;
            }
        }

        this.submissionService.editSubmission(submission)
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
            visaStatus: this.immigirationStatus,
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
            enteredBy: parseInt(this.rtsUserId)
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
                technologyId: parseInt(form.value.technology)
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
