import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef, HostListener } from '@angular/core';
import { Subscription, Observable, timer, Subject } from 'rxjs';
import * as moment from 'moment';
import { startWith, switchMap } from 'rxjs/operators';
import { TimeSheetService } from '../Services/timeSheet.service';

@Component({
  selector: 'app-auto-refresh',
  templateUrl: './auto-refresh.component.html',
  styleUrls: ['./auto-refresh.component.css']
})
export class AutoRefreshComponent implements OnInit {

  private subscription: Subscription;
  static reset = new Subject();

  @Output() TimerExpired: EventEmitter<any> = new EventEmitter<any>();
  @Input() SearchDate: moment.Moment = moment();
  @Input() ElapsTime: number = 1;
  searchEndDate: moment.Moment;
  remainingTime: number;
  minutes: number;
  seconds: number;
  everySecond: Observable<any>;
  // everySecond: Observable<number> = timer(0, 1000);
  constructor(private ref: ChangeDetectorRef,
    private timeSheetService: TimeSheetService, ) {
    this.searchEndDate = this.SearchDate.add(this.ElapsTime, "minutes");
    this.everySecond = AutoRefreshComponent.reset.pipe(
      startWith(0),
      switchMap(() => timer(0, 1000))
    );
  }
  
  ngOnInit() {
    this.subscription = this.everySecond.subscribe((seconds) => {
      var currentTime: moment.Moment = moment();
      this.remainingTime = this.searchEndDate.diff(currentTime)
      this.remainingTime = this.remainingTime / 1000;
      if (seconds >= 1200) { // 1200
        this.SearchDate = moment();
        this.searchEndDate = this.SearchDate.add(this.ElapsTime, "minutes");
        this.TimerExpired.emit();
      }
      else {
        this.minutes = Math.floor(this.remainingTime / 60);
        this.seconds = Math.floor(this.remainingTime - this.minutes * 60);
      }
      this.ref.markForCheck()
    })
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();  
  }

}
