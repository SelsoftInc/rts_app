import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { RequirementsService } from '../Services/requirements.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { ApiUrl } from '../Services/api-url';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

@Component({
    selector: 'app-interview-history',
    templateUrl: './interview-history.component.html',
    styleUrls: ['./interview-history.component.css'],
    providers: [LoggedUserService]
})
export class InterviewHistoryComponent implements OnInit {


    private rtsUser: any;
    private rtsUserId: any;
    private rtsCompanyId: any;
    private currentDate: Date;
    private startDate: Date;
    private userRole: any;
    private sortedData: any;
    private interviewReport: any;
    private interviewReportLength: any;
    public static userDetails: any;
    public static recruiter: any;
    public static team: any;
    public static client: any;
    public static interviewStatus: any;
    public static filterBy: any;
    private filter: any;
    clients: any;
    teams: any;
    teamUsers: any;
    isTeam: boolean;
    isClient: boolean;
    isRecruiter: boolean;
    isInterviewStatus: boolean;
    selectedInterviews: any;
    team: any;
    client: any;
    recruiter: any;
    interviewStatus: any;

    constructor(
        private loggedUser: LoggedUserService,
        private requirementService: RequirementsService,
        private submissonService: SubmissionService,
        private hideComponent: HideComponentService,
        private formBuilder: FormBuilder,
        private ngProgress: NgProgress
    ) {
        this.hideComponent.displayComponent = true;
        this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
        this.rtsCompanyId = this.rtsUser.companyId;
        this.rtsUserId = this.rtsUser.userId;
        this.userRole = this.rtsUser.role;
        this.currentDate = new Date(Date.now());
        this.startDate = new Date(Date.now());
        this.filter = '';
        this.interviewReport = [];
        this.selectedInterviews = [];
    }

    ngOnInit() {
        this.ngProgress.start();
        this.getCommonDetails();
        this.getInterviewDetails();
    }

    getCommonDetails() {
        const companyId = {
            userId: this.rtsUserId
        };

        this.requirementService.commonDetails(companyId)
            .subscribe(
                data => {
                    if (data.success) {
                        this.clients = data.clients;
                        this.teams = data.teams;
                        this.teamUsers = data.myTeamUser;
                    }
                });
    }

    getInterviewDetails() {

        const fromDate = moment(this.startDate).format('YYYY-MM-DD');
        const toDate = moment(this.currentDate).format('YYYY-MM-DD');

        let userId = {
            userId: this.rtsUserId,
            fromDate: fromDate,
            toDate: toDate
        };

        if (InterviewHistoryComponent.userDetails === undefined) {
            InterviewHistoryComponent.userDetails = userId;
        } else {
            userId = InterviewHistoryComponent.userDetails;
            this.startDate = moment(userId.fromDate, 'YYYY-MM-DD').toDate();
            this.currentDate = moment(userId.toDate, 'YYYY-MM-DD').toDate();
        }

        this.submissonService.getAllInterviewDetails(userId)
            .subscribe(
                data => {
                    if (data.success) {
                        this.ngProgress.done();
                        this.interviewReport = data.submissionReport;
                        this.selectedInterviews = this.interviewReport;
                        this.interviewReportLength = this.interviewReport.length;
                        this.sortedData = this.selectedInterviews.slice();
                        if (InterviewHistoryComponent.filterBy !== undefined) {
                            this.filter = InterviewHistoryComponent.filterBy;
                            this.filterBy(this.filter);
                            if (this.filter === 'recruiter') {
                                this.selectRecruiter(InterviewHistoryComponent.recruiter);
                            } else if (this.filter === 'team') {
                                this.selectTeam(InterviewHistoryComponent.team);
                            } else if (this.filter === 'client') {
                                this.selectClient(InterviewHistoryComponent.client);
                            }
                        }
                    }
                });
    }

    filterByDate() {
        InterviewHistoryComponent.userDetails = undefined;
        InterviewHistoryComponent.recruiter = undefined;
        InterviewHistoryComponent.client = undefined;
        InterviewHistoryComponent.team = undefined;
        InterviewHistoryComponent.interviewStatus = undefined;
        this.ngProgress.start();
        this.filterBy('');
        this.getInterviewDetails();
    }

    filterBy(value) {
        InterviewHistoryComponent.filterBy = value;

        if (value === 'team') {
            this.isTeam = true;
            this.isClient = false;
            this.isRecruiter = false;
            this.isInterviewStatus = false;
        } else if (value === 'client') {
            this.isClient = true;
            this.isTeam = false;
            this.isRecruiter = false;
            this.isInterviewStatus = false;
        } else if (value === 'recruiter') {
            this.isRecruiter = true;
            this.isTeam = false;
            this.isClient = false;
            this.isInterviewStatus = false;
        } else if (value === 'interviewStatus') {
            this.isRecruiter = false;
            this.isTeam = false;
            this.isClient = false;
            this.isInterviewStatus = true;
        } else if (value === '') {
            this.filter = '';
            this.isRecruiter = false;
            this.isTeam = false;
            this.isClient = false;
            this.isInterviewStatus = false;
        }
        this.recruiter = '';
        this.team = '';
        this.client = '';
        this.interviewStatus = '';
        this.selectedInterviewDetails(this.interviewReport);

    }


    selectTeam(event) {
        InterviewHistoryComponent.team = event;
        this.team = event;
        if (event === 'selectAll') {
            this.selectedInterviews = this.interviewReport;
            this.selectedInterviewDetails(this.selectedInterviews);
        } else {
            this.selectedInterviews = [];
            this.selectedInterviews = _.where(this.interviewReport, { teamId: event });
            this.selectedInterviewDetails(this.selectedInterviews);
        }
    }

    selectClient(event) {
        InterviewHistoryComponent.client = event;
        this.client = event;
        if (event === 'selectAll') {
            this.selectedInterviews = this.interviewReport;
            this.selectedInterviewDetails(this.selectedInterviews);
        } else {
            this.selectedInterviews = [];
            this.selectedInterviews = _.where(this.interviewReport, { clientId: event });
            this.selectedInterviewDetails(this.selectedInterviews);
        }
    }

    selectRecruiter(event) {
        InterviewHistoryComponent.recruiter = event;
        this.recruiter = event;
        if (event === 'selectAll') {
            this.selectedInterviews = this.interviewReport;
            this.selectedInterviewDetails(this.selectedInterviews);
        } else {
            this.selectedInterviews = [];
            this.selectedInterviews = _.where(this.interviewReport, { recruiterId: event });
            this.selectedInterviewDetails(this.selectedInterviews);
        }
    }

    selectInterviewStatus(event) {
        InterviewHistoryComponent.interviewStatus = event;
        this.interviewStatus = event;
        if (event === 'selectAll') {
            this.selectedInterviews = this.interviewReport;
            this.selectedInterviewDetails(this.selectedInterviews);
        } else {
            this.selectedInterviews = [];
            this.selectedInterviews = _.where(this.interviewReport, { interviewDetailStatus: event });
            this.selectedInterviewDetails(this.selectedInterviews);
        }
    }

    sortData(sort: Sort) {
        const data = this.selectedInterviews.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'positionName': return this.compare(a.positionName, b.positionName, isAsc);
                case 'candidateName': return this.compare(a.candidateName, b.candidateName, isAsc);
                case 'clientName': return this.compare(a.clientName, b.clientName, isAsc);
                case 'InterviewDateTime': return this.compare(a.interviewDateStr, b.interviewDateStr, isAsc);
                case 'InterviewLevel': return this.compare(a.interviewLevel, b.interviewLevel, isAsc);
                case 'recruiterName': return this.compare(a.recruiterName, b.recruiterName, isAsc);
                case 'skype': return this.compare(a.skypeId, b.skypeId, isAsc);
                case 'phoneNumber': return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
                case 'currentStatus': return this.compare(a.currentStatus, b.currentStatus, isAsc);
                case 'interviewStatus': return this.compare(a.interviewDetailStatus, b.interviewDetailStatus, isAsc);
                default: return 0;
            }
        });
    }

    compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    selectedInterviewDetails(data) {
        this.selectedInterviews = data;
        this.interviewReportLength = this.selectedInterviews.length;
        this.sortedData = this.selectedInterviews.slice();
    }
}
