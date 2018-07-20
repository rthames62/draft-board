import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Pick } from './pick';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  draftResults: Array<Pick> = [];
  currentPick: Number = 1;

  private advanceDraft(){
    this.currentPick =+ 1;
  }

  constructor(private http: Http) { }

  assignPick(team, player, override?) {
    let pick = {
      pickNumber: this.currentPick,
      team: team,
      pick: player
    };
    console.log(this.draftResults);
    this.draftResults.push(pick);

    if(!override){
      this.advanceDraft();
    }
  }
}
