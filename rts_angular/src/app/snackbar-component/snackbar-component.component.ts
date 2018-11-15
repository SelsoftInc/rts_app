import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snackbar-component',
  templateUrl: './snackbar-component.component.html',
  styleUrls: ['./snackbar-component.component.css']
})
export class SnackbarComponentComponent implements OnInit {

  public snackBarRefSnackbarComponent: any;
  notification: any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private router: Router
  ) { }

  ngOnInit() {
    this.notification = this.data.payload.notification.body;
  }

  openSnackbar() {
    if (this.data.payload.notification.title === 'Submission Added') {
      this.router.navigate(['/submissions']);
    } else {
      this.router.navigate(['/requirements']);
    }
    this.snackBarRefSnackbarComponent.dismiss();
  }

  closeSnackbar() {
    this.snackBarRefSnackbarComponent.dismiss();
  }

}
