import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pick-selector',
  templateUrl: './pick-selector.component.html',
  styleUrls: ['./pick-selector.component.css']
})
export class PickSelectorComponent implements OnInit {
  @Input() selectedPlayer;
  @Input() team;

  constructor() { }

  ngOnInit() {
    this.selectedPlayer = {
      displayName: ''
    }
  }

}
