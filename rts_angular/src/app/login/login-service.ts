import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiUrl } from '../Services/api-url';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {
    authToken: any;
    user: any;

    constructor(private http: Http,
        private router: Router) { }

    authenticateUser(user) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UserLogin, user,
            { headers: headers })
            .map(res => res.json());
    }

    storeUserData(token, rts) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('rts_user', JSON.stringify(rts));
        localStorage.setItem('user_id', rts.userId);
        this.authToken = token;
        this.user = rts;
    }

    logout() {
        const token = localStorage.getItem('id_token');
        const userId = localStorage.getItem('user_id');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);
        const user = {
            userId: parseInt(userId),
            autoLogout: true
        };

        fetch(ApiUrl.BaseUrl + ApiUrl.UserLogout, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then(response => {
                localStorage.removeItem('id_token');
                localStorage.removeItem('rts_user');
                localStorage.removeItem('user_id');
                this.router.navigate(['login']);
                return response.json();
            });
    }


    forgotPassword(email) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(ApiUrl.BaseUrl + ApiUrl.ForgotPassword, email,
            { headers: headers })
            .map(res => res.json());
    }

    isLogout(userId) {
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UserLogout, userId,
            { headers: headers })
            .map(res => {
                this.authToken = null;
                this.user = null;
                localStorage.removeItem('id_token');
                localStorage.removeItem('rts_user');
                localStorage.removeItem('user_id');
                this.router.navigate(['login']);
                return res.json();
            }).catch(err => {
                if (err.status === 401) {
                    this.router.navigate(['login']);
                }
                return '{}';

            });
    }

}
