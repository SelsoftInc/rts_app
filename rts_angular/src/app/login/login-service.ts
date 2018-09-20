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
        this.authToken = token;
        this.user = rts;
    }

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.removeItem('id_token');
        localStorage.removeItem('rts_user');
        this.router.navigate(['login']);
    }

    forgotPassword(email) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(ApiUrl.BaseUrl + ApiUrl.ForgotPassword, email,
            { headers: headers })
            .map(res => res.json());
    }
}
