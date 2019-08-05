import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/Services/api-url';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoginService } from '../login/login-service';
import { AutoRefreshComponent } from '../auto-refresh/auto-refresh.component';


@Injectable()
export class UserService {
    constructor(private http: Http,
        private router: Router,
        private loginService: LoginService) { }

    allUsers(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetAllUsersForAdmin, userId,
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

    manageUsers(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.ManageUsers, userId,
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

    addUser(user) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.AddUser, user,
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

    editUser(editUser) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UpdateUser, editUser,
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

    deleteUser(userId) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.DeleteUser, userId,
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

    getActiceUsers(user) {
        AutoRefreshComponent.reset.next(void 0);
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetActiveUsers, user,
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
