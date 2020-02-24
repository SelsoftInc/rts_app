import { Injectable } from '@angular/core';

@Injectable()
export class ApiUrl {

    static BaseUrl = 'http://rameshrasaiyan.com:8080/';

    // base url production
    // static BaseUrl = 'https://trackmeall.com:8443/';

    // Requiremnt api
    // static GetRequirementForStatus = 'rtsRequirement/requirement/getRequirementByStatus';
    static GetRequirementForTeam = 'rtsRequirement/requirement/getRequirementByAllocationTeam';
    // static GetRequirementForClient = 'rtsRequirement/requirement/getAllRequirementByClient';
    static GetRequirementForRecruiter = 'rtsRequirement/requirement/getRequirementsForAllocationUser';
    static GetRequirementForSubmission = 'rtsRequirement/requirement/getRequirementBySubmission';
    static GetUserSubmission = 'rtsRequirement/requirement/userSubmission';
    static GetTeamSubmission = 'rtsRequirement/requirement/teamSubmission';
    static GetRequirementsSubmissionByDate = 'rtsRequirement/requirement/getRequirementSubmissionByDate';
    static GetClientRequirements = 'rtsRequirement/requirement/clientWiseOpenRequirement';
    static GetRequirementById = 'rtsRequirement/requirement/getRequirementById';
    static UpdateRequirement = 'rtsRequirement/requirement/updateRequirement';
    static GetAllRequiementsForUser = 'rtsRequirement/requirement/getAllAllocationRequirementForUser';
    static GetAllRequirementsByCompany = 'rtsRequirement/requirement/getAllRequirementByCompany';
    static GetAllRequirementsByTeam = 'rtsRequirement/requirement/getAllRequirementByTeam';
    static AddNewRequirement = 'rtsRequirement/requirement/insertRequirement';
    // static SaveRequirement = 'rtsRequirement/requirement/saveRequirement';

    // user api
    static AddCompanyUser = 'rtsUser/user/addCompanyUser';
    static UserLogin = 'rtsUser/user/userLogin';
    static GetAllUsersForAdmin = 'rtsUser/user/getAllUserForCompany';
    static ManageUsers = 'rtsUser/user/manageUser';
    static AddUser = 'rtsUser/user/addUser';
    static UpdateUser = 'rtsUser/user/updateUser';
    static DeleteUser = 'rtsUser/user/deleteUser';
    static ForgotPassword = 'rtsUser/user/forgotPassword';
    static UpdateFcmToken = 'rtsUser/user/updateFcmToken';
    static UserLogout = 'rtsUser/user/userLogout';
    static GetActiveUsers = 'rtsUser/user/getActiveUser';


    //submission api
    static AddNewSubmission = 'rtsSubmission/submission/newSubmission';
    static SaveSubmission = 'rtsSubmission/submission/saveSubmission';
    static UpdateSubmission = 'rtsSubmission/submission/updateSubmission';
    // static SubmissionFileUpload = 'rtsSubmission/submission/fileUpload';
    static SubmissionToClient = 'rtsSubmission/submission/submissionToClient';
    static GenerateReport = 'rtsSubmission/submission/excelReport';
    static ReportDownload = 'rtsSubmission/submission/excelDownload';
    static AddComment = 'rtsSubmission/submission/addComment';
    static InterViewReport = 'rtsSubmission/submission/interviewReport';
    static GetAllInterviewDetails = 'rtsSubmission/submission/interviewHistory';
    static GetAllProgressInterviews = 'rtsSubmission/submission/progressInterview';
    static GetAllOnBoardReminder = 'rtsSubmission/submission/onBoardingReminder';
    static GetAllSelectedSubmission = 'rtsSubmission/submission/selectedSubmission';

    // client api
    static GetAllClientsForCompany = 'rtsClient/client/getAllClientForCompany';
    static AddClient = 'rtsClient/client/addClient';
    static UpdateClient = 'rtsClient/client/updateClient';
    static GetClientById = 'rtsClient/client/getClientById';

    // candidate api
    static GetCandidateDetails = 'rtsCandidate/candidate/findCandidateByEmail';
    static GettAllCandidates = 'rtsCandidate/candidate/getAllCompanyCandidate';
    static AddNewCandidate = 'rtsCandidate/candidate/addNewCandidate';
    static CandidateFileUpload = 'rtsCandidate/candidate/fileUpload';
    static UpdateCandidate = 'rtsCandidate/candidate/updateCandidate';
    static GetCandidateById = 'rtsCandidate/candidate/candidateById';
    static GetCandidateBySkills = 'rtsCandidate/candidate/searchBySkills';

    // team api
    static AddTeam = 'rtsTeam/team/createTeam';
    static EditTeam = 'rtsTeam/team/updateTeam';
    static DeleteTeam = 'rtsTeam/team/deleteTeam';

    // common api
    static GetUserGraphDetails = 'rtsCommon/common/getGraphDetails';
    static GetTeamGraphDetails = 'rtsCommon/common/getTeamGraphDetails';
    static GetClientOpenRequirements = 'rtsCommon/common/clientWiseOpenRequirement';
    static GetNoSubmissionsRequirement = 'rtsCommon/common/noSubmissionsRequirement';
    static GetClientSubmissionStatus = 'rtsCommon/common/clientSubmissionStatus';
    static GetRecruiterComparison = 'rtsCommon/common/recruiterComparison';
    static GetTeamComparison = 'rtsCommon/common/teamComparison';
    static GetRecruiterTeamStatus = 'rtsCommon/common/recruiterTeamStatus';
    static GetRecruiterTeamSubmissions = 'rtsCommon/common/recruiterTeamSubmissions';
    static GetRecruiterSubmissionStatus = 'rtsCommon/common/recruiterSubmissionStatus';
    static GetCommonDetails = 'rtsCommon/common/getAllCommonDetails';
    static GetAllSkills = '/rtsCommon/common/getAllSkills';

    // vendor api
    static GetAllVendors = 'rtsVendor/vendor/getAllVendors';

    // timesheet api 
    // static TimeSheetInOrOut = 'rtsTimeSheet/timeSheet/sessionInOrOut';
    static GetWeekSheet = 'rtsTimeSheet/timeSheet/getWeekSheet';
    static GetAllWeekSheet = 'rtsTimeSheet/timeSheet/allWeekSheet';
    static SendTimeSheetToMail = 'rtsTimeSheet/timeSheet/sendTimeSheetToMail';
    // static TimeSheetReport = 'rtsTimeSheet/timeSheet/timeSheetReport';
    static LeaveRequest = 'rtsTimeSheet/timeSheet/leaveRequest';
    static CancelLeaveRequest = 'rtsTimeSheet/timeSheet/cancelLeaveRequest';
    static CreateHoliday = 'rtsTimeSheet/timeSheet/createHoliday';
    static GetHolidays = 'rtsTimeSheet/timeSheet/holidayList';
    static UpcomingLeaveRequest = 'rtsTimeSheet/timeSheet/upcomingLeaveRequest';

    //Dice api
    static AddDice = 'rtsDice/dice/addDiceAccount';
    static EditDice = 'rtsDice/dice/editDiceAccount';
    static SetDefaultDice = 'rtsDice/dice/setDefaultDiceAccount';
    static GetAllDice = 'rtsDice/dice/getAllDiceAccount';
    static DiceSearch = 'rtsDice/dice/diceSearch';
    static GetDiceProfile = 'rtsDice/dice/diceProfileView';
    static GetAllDiceCandidates = 'rtsDice/dice/getDiceCandidate';









}
