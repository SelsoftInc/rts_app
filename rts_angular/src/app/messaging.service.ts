import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from './Services/api-url';
import { Http, Headers } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Router } from '@angular/router';
import { SnackbarComponentComponent } from './snackbar-component/snackbar-component.component';

@Injectable()
export class MessagingService {
    payload;
    private snackBarRef: any;

    currentMessage = new BehaviorSubject(null);

    constructor(
        private angularFireAuth: AngularFireAuth,
        private angularFireMessaging: AngularFireMessaging,
        private toastr: ToastrService,
        private snackBar: MatSnackBar,
        private http: Http,
        private router: Router
    ) {
        this.angularFireMessaging.messaging.subscribe(
            (_messaging) => {
                _messaging.onMessage = _messaging.onMessage.bind(_messaging);
                _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
            }
        );
    }

    updateToken(userId, fcmToken) {
        const user = {
            userId: userId,
            fcmToken: fcmToken
        };
        const headers = new Headers();
        const token = localStorage.getItem('id_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', token);

        return this.http.post(ApiUrl.BaseUrl + ApiUrl.UpdateFcmToken, user,
            { headers: headers })
            .map(res => {
                return res.json();
            });
    }

    requestPermission(userId) {
        this.angularFireMessaging.requestToken.subscribe(
            (fcmToken) => {
                this.updateToken(userId, fcmToken).subscribe();
                this.toastr.info('Notifications have been enabled', '', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 5000,
                });
            },
            (err) => {
                this.toastr.error('Notifications have been blocked', '', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 5000,
                });
            }
        );
    }

    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => {
                this.payload = payload;
                this.currentMessage.next(this.payload);
                this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponentComponent, {
                    verticalPosition: 'bottom',
                    horizontalPosition: 'end',
                    duration: 10000,
                    data: { payload: this.payload }
                });
                this.snackBarRef.instance.snackBarRefSnackbarComponent = this.snackBarRef;
            });
    }

}
