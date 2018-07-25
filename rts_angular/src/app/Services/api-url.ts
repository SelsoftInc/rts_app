import { Injectable } from '@angular/core';

@Injectable()
export class ApiUrl {

    static BaseUrl = 'http://rameshrasaiyan.com:8080/';

    static AddCompanyUser = 'rtsUser/user/addCompanyUser';
    static UserLogin = 'rtsUser/user/userLogin';
    static GetAllRequirementsByCompany = 'rtsRequirement/requirement/getAllRequirementByCompany';
    static AddNewRequirement = 'rtsRequirement/requirement/insertRequirement';
    static GetAllUsersForAdmin = 'rtsUser/user/getAllUserForAdmin';
    static AddUser = 'rtsUser/user/addUser';
    static GetAllRequiementsForUser = 'rtsRequirement/requirement/getAllAllocationRequirementForUser';
    static AddNewSubmission = 'rtsSubmission/submission/newSubmission';
    static UpdateSubmission = 'rtsSubmission/submission/updateSubmission';
    static SubmissionFileUpload = 'rtsSubmission/submission/fileUpload';
    static GetAllClientsForCompany = 'rtsClient/client/getAllClientForCompany';
    static AddClient = 'rtsClient/client/addClient';
    static GetCommonDetails = 'rtsCommon/common/getAllCommonDetails';
    static GetCandidateDetails = 'rtsCandidate/candidate/findCandidateByEmail';
    static GettAllCandidates = 'rtsCandidate/candidate/getAllCompanyCandidate';
    static AddNewCandidate = 'rtsCandidate/candidate/addNewCandidate';
    static CandidateFileUpload = 'rtsCandidate/candidate/fileUpload';
    static SubmissionToClient = 'rtsSubmission/submission/submissionToClient';
    static GenerateReport = 'rtsSubmission/submission/excelReport';
}
