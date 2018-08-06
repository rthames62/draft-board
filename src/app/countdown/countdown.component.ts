import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  countdownNumber: number = 10;
  countdownObs = Observable.timer(1000, 1000);
  countdownSubscription;

  @Output() countdownFinished = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.countdownSubscription = this.countdownObs.subscribe(t => {
      if(this.countdownNumber > 0) {
        this.countdownNumber -= 1;
      } else {
        this.countdownSubscription.unsubscribe();
        this.countdownFinished.emit(true);
      }
    });
  }

}
