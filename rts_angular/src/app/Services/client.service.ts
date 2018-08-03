import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/Services/api-url';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoginService } from '../login/login-service';


@Injectable()
export class ClientService {
    constructor(private http: Http,
        private router: Router,
        private loginService: LoginService) { }

    addClient(client) {
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.AddClient, client,
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

    editClient(editClient) {
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UpdateClient, editClient,
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

    allClients(companyId) {
        const token = localStorage.getItem('id_token');
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetAllClientsForCompany, companyId,
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
