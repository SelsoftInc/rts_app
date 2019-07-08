import { Injectable } from '@angular/core';

@Injectable()
export class ApiUrl {

    static BaseUrl = 'http://rameshrasaiyan.com:8080/';

    // base url production
    // static BaseUrl = 'https://trackmeall.com:8443/';

    // Requiremnt api
    // static GetRequirementForStatus = 'rtsRequirementMySQL/requirement/getRequirementByStatus';
    static GetRequirementForTeam = 'rtsRequirementMySQL/requirement/getRequirementByAllocationTeam';
    // static GetRequirementForClient = 'rtsRequirementMySQL/requirement/getAllRequirementByClient';
    static GetRequirementForRecruiter = 'rtsRequirementMySQL/requirement/getRequirementsForAllocationUser';
    static GetRequirementForSubmission = 'rtsRequirementMySQL/requirement/getRequirementBySubmission';
    static GetUserSubmission = 'rtsRequirementMySQL/requirement/userSubmission';
    static GetTeamSubmission = 'rtsRequirementMySQL/requirement/teamSubmission';
    static GetRequirementsSubmissionByDate = 'rtsRequirementMySQL/requirement/getRequirementSubmissionByDate';
    static GetClientRequirements = 'rtsRequirementMySQL/requirement/clientWiseOpenRequirement';
    static GetRequirementById = 'rtsRequirementMySQL/requirement/getRequirementById';
    static UpdateRequirement = 'rtsRequirementMySQL/requirement/updateRequirement';
    static GetAllRequiementsForUser = 'rtsRequirementMySQL/requirement/getAllAllocationRequirementForUser';
    static GetAllRequirementsByCompany = 'rtsRequirementMySQL/requirement/getAllRequirementByCompany';
    static GetAllRequirementsByTeam = 'rtsRequirementMySQL/requirement/getAllRequirementByTeam';
    static AddNewRequirement = 'rtsRequirementMySQL/requirement/insertRequirement';
    // static SaveRequirement = 'rtsRequirementMySQL/requirement/saveRequirement';

    // user api
    static AddCompanyUser = 'rtsUserMySQL/user/addCompanyUser';
    static UserLogin = 'rtsUserMySQL/user/userLogin';  
    static GetAllUsersForAdmin = 'rtsUserMySQL/user/getAllUserForCompany';
    static ManageUsers = 'rtsUserMySQL/user/manageUser';
    static AddUser = 'rtsUserMySQL/user/addUser';
    static UpdateUser = 'rtsUserMySQL/user/updateUser';
    static DeleteUser = 'rtsUserMySQL/user/deleteUser';
    static ForgotPassword = 'rtsUserMySQL/user/forgotPassword';
    static UpdateFcmToken = 'rtsUserMySQL/user/updateFcmToken';

    //submission api
    static AddNewSubmission = 'rtsSubmissionMySQL/submission/newSubmission';
    static SaveSubmission = 'rtsSubmissionMySQL/submission/saveSubmission';
    static UpdateSubmission = 'rtsSubmissionMySQL/submission/updateSubmission';
    // static SubmissionFileUpload = 'rtsSubmissionMySQL/submission/fileUpload';
    static SubmissionToClient = 'rtsSubmissionMySQL/submission/submissionToClient';
    static GenerateReport = 'rtsSubmissionMySQL/submission/excelReport';
    static ReportDownload = 'rtsSubmissionMySQL/submission/excelDownload';
    static AddComment = 'rtsSubmissionMySQL/submission/addComment';
    static InterViewReport = 'rtsSubmissionMySQL/submission/interviewReport';
    static GetAllInterviewDetails = 'rtsSubmissionMySQL/submission/interviewHistory';
    static GetAllProgressInterviews = 'rtsSubmissionMySQL/submission/progressInterview';
    static GetAllOnBoardReminder = 'rtsSubmissionMySQL/submission/onBoardingReminder';
    static GetAllSelectedSubmission = 'rtsSubmissionMySQL/submission/selectedSubmission';
  
    // client api
    static GetAllClientsForCompany = 'rtsClientMySQL/client/getAllClientForCompany';
    static AddClient = 'rtsClientMySQL/client/addClient';
    static UpdateClient = 'rtsClientMySQL/client/updateClient';  
    static GetClientById = 'rtsClientMySQL/client/getClientById';  
    
    // candidate api
    static GetCandidateDetails = 'rtsCandidateMySQL/candidate/findCandidateByEmail';
    static GettAllCandidates = 'rtsCandidateMySQL/candidate/getAllCompanyCandidate';
    static AddNewCandidate = 'rtsCandidateMySQL/candidate/addNewCandidate';
    static CandidateFileUpload = 'rtsCandidateMySQL/candidate/fileUpload';   
    static UpdateCandidate = 'rtsCandidateMySQL/candidate/updateCandidate';
    static GetCandidateById = 'rtsCandidateMySQL/candidate/candidateById';
    static GetCandidateByTechnology = 'rtsCandidateMySQL/candidate/searchByTechnology';

    // team api
    static AddTeam = 'rtsTeamMySQL/team/createTeam';
    static EditTeam = 'rtsTeamMySQL/team/updateTeam';
    static DeleteTeam = 'rtsTeamMySQL/team/deleteTeam';   
  
    // common api
    static GetUserGraphDetails = 'rtsCommonMySQL/common/getGraphDetails';
    static GetTeamGraphDetails = 'rtsCommonMySQL/common/getTeamGraphDetails';
    static GetClientOpenRequirements = 'rtsCommonMySQL/common/clientWiseOpenRequirement';    
    static GetNoSubmissionsRequirement = 'rtsCommonMySQL/common/noSubmissionsRequirement';
    static GetClientSubmissionStatus = 'rtsCommonMySQL/common/clientSubmissionStatus';
    static GetRecruiterComparison = 'rtsCommonMySQL/common/recruiterComparison';
    static GetTeamComparison = 'rtsCommonMySQL/common/teamComparison';
    static GetRecruiterTeamStatus = 'rtsCommonMySQL/common/recruiterTeamStatus';
    static GetRecruiterTeamSubmissions = 'rtsCommonMySQL/common/recruiterTeamSubmissions';
    static GetRecruiterSubmissionStatus = 'rtsCommonMySQL/common/recruiterSubmissionStatus';
    static GetCommonDetails = 'rtsCommonMySQL/common/getAllCommonDetails';

    // vendor api
    static GetAllVendors = 'rtsVendorMySQL/vendor/getAllVendors';

    

}
