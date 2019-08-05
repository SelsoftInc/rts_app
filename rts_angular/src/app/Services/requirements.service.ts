import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/Services/api-url';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoginService } from '../login/login-service';
import { AutoRefreshComponent } from '../auto-refresh/auto-refresh.component';




@Injectable()
export class RequirementsService {

    constructor(private http: Http,
        private router: Router,
        private loginService: LoginService) { }

    requirementsDetails(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetAllRequirementsByCompany, userId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    // requirementsDetailsForStatus(userId) {
    //     const token = localStorage.getItem('id_token');
    //     const headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Authorization', token);

    //     return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetRequirementForStatus, userId,
    //         { headers: headers })
    //         .map(res => {
    //             const responseToken = res.headers.get('refresh-token');
    //             localStorage.setItem('id_token', responseToken);
    //             return res.json();
    //         }).catch(err => {
    //             if (err.status === 401) {
    //                 this.loginService.logout();
    //             }
    //             return '{}';
    //         });
    // }

    requirementsDetailsForTeam(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetRequirementForTeam, userId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    getRequirementsById(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetRequirementById, userId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    // requirementsDetailsForClient(userId) {
    //     const token = localStorage.getItem('id_token');
    //     const headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Authorization', token);

    //     return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetRequirementForClient, userId,
    //         { headers: headers })
    //         .map(res => {
    //             const responseToken = res.headers.get('refresh-token');
    //             localStorage.setItem('id_token', responseToken);
    //             return res.json();
    //         }).catch(err => {
    //             if (err.status === 401) {
    //                 this.loginService.logout();
    //             }
    //             return '{}';
    //         });
    // }

    requirementsDetailsForRecruiter(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetRequirementForRecruiter, userId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    getAllSubmissionsByDate(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetRequirementsSubmissionByDate, userId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    commonDetails(companyId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetCommonDetails, companyId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    getAllSkills(companyId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetAllSkills, companyId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    requirementsDetailsForUser(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetAllRequiementsForUser, userId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    requirementsDetailsByTeam(teamId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetAllRequirementsByTeam, teamId,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    addRequirements(newRequirement) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.AddNewRequirement, newRequirement,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }

    // saveRequirement(saveRequirement) {
    //     const token = localStorage.getItem('id_token');
    //     const headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Authorization', token);

    //     return this.http.post(ApiUrl.BaseUrl + ApiUrl.SaveRequirement, saveRequirement,
    //         { headers: headers })
    //         .map(res => {
    //             const responseToken = res.headers.get('refresh-token');
    //             localStorage.setItem('id_token', responseToken);
    //             return res.json();
    //         }).catch(err => {
    //             if (err.status === 401) {
    //                 this.loginService.logout();
    //             }
    //             return '{}';
    //         });
    // }

    updateRequirement(editRequirement) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UpdateRequirement, editRequirement,
            { headers: headers })
            .map(res => {
                const responseToken = res.headers.get('refresh-token');
                localStorage.setItem('id_token', responseToken);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.loginService.logout();
                }
                return '{}';
            });
    }
}
