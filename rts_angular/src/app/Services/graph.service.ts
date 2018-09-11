import { Injectable } from '@angular/core';
import { ApiUrl } from 'src/app/Services/api-url';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { LoginService } from '../login/login-service';


@Injectable()
export class GraphService {

  constructor(private http: Http,
    private router: Router,
    private loginService: LoginService) { }

  userGraphDetails(graph) {
    const token = localStorage.getItem('id_token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetUserGraphDetails, graph,
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

  teamGraphDetails(graph) {
    const token = localStorage.getItem('id_token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetTeamGraphDetails, graph,
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

  getClientOpenRequirements(graph) {
    const token = localStorage.getItem('id_token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetClientOpenRequirements, graph,
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

  getInterviewDetails(graph) {
    const token = localStorage.getItem('id_token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this.http.post(ApiUrl.BaseUrl + ApiUrl.InterViewReport, graph,
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

  clientSubmissionStatus(graph) {
    const token = localStorage.getItem('id_token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetClientSubmissionStatus, graph,
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

  noSubmissionsRequirement(graph) {
    const token = localStorage.getItem('id_token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);

    return this.http.post(ApiUrl.BaseUrl + ApiUrl.GetNoSubmissionsRequirement, graph,
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
