import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/Services/api-url';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoginService } from '../login/login-service';
import { AutoRefreshComponent } from '../auto-refresh/auto-refresh.component';

@Injectable()
export class CandidateService {
    constructor(private http: Http,
        private router: Router,
        private loginService: LoginService) { }

    getCandidate(candidate) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetCandidateDetails, candidate,
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

    allCandidate(company) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GettAllCandidates, company,
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

    getCandidateById(company) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetCandidateById, company,
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

    getCandidateByTechnology(tech) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetCandidateBySkills, tech,
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

    removeEmail(tech) {
      AutoRefreshComponent.reset.next(void 0);
      const token = localStorage.getItem('id_token');
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', token);

      return this.http.post(ApiUrl.BaseUrl + ApiUrl.RemoveEmail, tech,
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

    addCandidate(newCandidate) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.AddNewCandidate, newCandidate,
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

    editCandidate(updateCandidate) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UpdateCandidate, updateCandidate,
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

    uploadFile(upload) {
        const formData = new FormData();
        const headers = new Headers();
        const token = localStorage.getItem('id_token');
        headers.append('Authorization', token);
        for (const file of upload.file) {
            formData.append('file', file);
        }

        formData.append('candidateId', upload.candidateId);
        formData.append('enteredBy', upload.enteredBy);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.CandidateFileUpload, formData, { headers: headers })
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
