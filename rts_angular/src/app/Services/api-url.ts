import { Injectable } from '@angular/core';

@Injectable()
export class ApiUrl {

    static BaseUrl = 'http://rameshrasaiyan.com:8080/';

    // base url production
    // static BaseUrl = 'https://trackmeall.com:8443/';

    static AddCompanyUser = 'rtsUser/user/addCompanyUser';
    static UserLogin = 'rtsUser/user/userLogin';
    static GetAllRequirementsByCompany = 'rtsRequirement/requirement/getAllRequirementByCompany';
    static GetAllRequirementsByTeam = 'rtsRequirement/requirement/getAllRequirementByTeam';
    static AddNewRequirement = 'rtsRequirement/requirement/insertRequirement';
    static SaveRequirement = 'rtsRequirement/requirement/saveRequirement';
    static GetAllUsersForAdmin = 'rtsUser/user/getAllUserForCompany';
    static ManageUsers = 'rtsUser/user/manageUser';
    static AddUser = 'rtsUser/user/addUser';
    static GetAllRequiementsForUser = 'rtsRequirement/requirement/getAllAllocationRequirementForUser';
    static AddNewSubmission = 'rtsSubmission/submission/newSubmission';
    static SaveSubmission = 'rtsSubmission/submission/saveSubmission';
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
    static UpdateRequirement = 'rtsRequirement/requirement/updateRequirement';
    static ReportDownload = 'rtsSubmission/submission/excelDownload';
    static UpdateCandidate = 'rtsCandidate/candidate/updateCandidate';
    static UpdateClient = 'rtsClient/client/updateClient';
    static UpdateUser = 'rtsUser/user/updateUser';
    static DeleteUser = 'rtsUser/user/deleteUser';
    static AddTeam = 'rtsTeam/team/createTeam';
    static EditTeam = 'rtsTeam/team/updateTeam';
    static DeleteTeam = 'rtsTeam/team/deleteTeam';
    static GetRequirementForStatus = 'rtsRequirement/requirement/getRequirementByStatus';
    static GetRequirementForTeam = 'rtsRequirement/requirement/getRequirementByAllocationTeam';
    static GetRequirementForClient = 'rtsRequirement/requirement/getAllRequirementByClient';
    static GetRequirementForRecruiter = 'rtsRequirement/requirement/getRequirementsForAllocationUser';
    static GetRequirementForSubmission = 'rtsRequirement/requirement/getRequirementBySubmission';
    static GetUserGraphDetails = 'rtsCommon/common/getGraphDetails';
    static GetTeamGraphDetails = 'rtsCommon/common/getTeamGraphDetails';
    static GetClientOpenRequirements = 'rtsCommon/common/clientWiseOpenRequirement';
    static GetUserSubmission = 'rtsRequirement/requirement/userSubmission';
    static GetTeamSubmission = 'rtsRequirement/requirement/teamSubmission';
    static GetRequirementsSubmissionByDate = 'rtsRequirement/requirement/getRequirementSubmissionByDate';
    static GetClientRequirements = 'rtsRequirement/requirement/clientWiseOpenRequirement';
    static AddComment = 'rtsSubmission/submission/addComment';
    static InterViewReport = 'rtsSubmission/submission/interviewReport';
    static GetNoSubmissionsRequirement = 'rtsCommon/common/noSubmissionsRequirement';
    static GetClientSubmissionStatus = 'rtsCommon/common/clientSubmissionStatus';
    static GetRecruiterComparison = 'rtsCommon/common/recruiterComparison';
    static GetTeamComparison = 'rtsCommon/common/teamComparison';
    static GetRecruiterTeamStatus = 'rtsCommon/common/recruiterTeamStatus';
    static GetRecruiterTeamSubmissions = 'rtsCommon/common/recruiterTeamSubmissions';
    static ForgotPassword = 'rtsUser/user/forgotPassword';
    static GetRequirementById = 'rtsRequirement/requirement/getRequirementById';
    static GetRecruiterSubmissionStatus = 'rtsCommon/common/recruiterSubmissionStatus';
    static GetAllInterviewDetails = 'rtsSubmission/submission/interviewHistory';
    static GetAllProgressInterviews = 'rtsSubmission/submission/progressInterview';
    static UpdateFcmToken = 'rtsUser/user/updateFcmToken';
    static GetCandidateById = 'rtsCandidate/candidate/candidateById';
    static GetAllOnBoardReminder = 'rtsSubmission/submission/onBoardingReminder';
    static GetAllSelectedSubmission = 'rtsSubmission/submission/selectedSubmission';
}
