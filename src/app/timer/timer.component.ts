import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DraftService } from '../draft.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnChanges {

  @Input() pickMade;

  timer = {
    minutes: 5,
    seconds: 0,
    underTen: '0',
    obs: Observable.timer(1000, 1000)
  }

  timerSubscription;

  constructor(private draftService: DraftService) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    switch(changes.pickMade.currentValue) {
      case 'start': this.startTimer(); break;
      case 'nextPick': this.restartTimer(); break;
      case 'stop': this.stopTimer(); break;
    }
  }

  startTimer(){

    this.timerSubscription = this.timer.obs.subscribe(t=>{
      if(this.timer.seconds === 0 && this.timer.minutes === 0) {
        this.timerSubscription.unsubscribe();
      } else if(this.timer.seconds === 0) {
        this.timer.minutes -= 1;
        this.timer.seconds = 59;
        this.timer.underTen = '';
      } else if(this.timer.seconds <= 10) {
        this.timer.underTen = '0';
        this.timer.seconds -= 1;
      } else {
        this.timer.underTen = '';
        this.timer.seconds -= 1;
      }
    });

    
  }

  stopTimer() {
    this.timerSubscription.unsubscribe();
    this.timer.minutes = 5;
    this.timer.seconds = 0;
    this.timer.underTen = '0';
  }

  restartTimer() {
    this.stopTimer();
    this.startTimer();
  }
}
