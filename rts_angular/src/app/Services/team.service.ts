import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/Services/api-url';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoginService } from '../login/login-service';
import { AutoRefreshComponent } from '../auto-refresh/auto-refresh.component';


@Injectable()
export class TeamService {
    constructor(private http: Http,
        private router: Router,
        private loginService: LoginService) { }

    addTeam(team) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.AddTeam, team,
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

    editTeam(team) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.EditTeam, team,
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

    deleteTeam(team) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.DeleteTeam, team,
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
