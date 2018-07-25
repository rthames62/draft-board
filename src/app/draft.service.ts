import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { map } from 'rxjs/operators';

import { TeamsService } from './teams.service'; 
import { Pick } from './pick';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  draftResults = [];
  currentPick = 1;
  currentRound = 1;
  overallPick;

  private advanceDraft(){
    this.overallPick += 1;
    
    if((this.currentPick % 12) === 1 && this.overallPick > 12) {
      console.log('next round');
      this.currentPick = 1;
      this.currentRound +=1;
    } else {
      this.currentPick += 1;
    }
  }

  constructor(
    private http: Http,
    private teamsService: TeamsService
  ) {
    
  }

  assignPick(currentPick, player) {
    let thisPick = this.draftResults[currentPick.round - 1][currentPick.pickNumber - 1]

    thisPick.pick.displayName = player.displayName;
    thisPick.pick.position = player.position;
    thisPick.pick.team = player.team;

    if(currentPick.pickNumber === this.currentPick){
      this.advanceDraft();
    }

    return this.draftResults;
  }

  buildDraftResults(teams){
    let overallPick = 1;
    let currentRound = 1;
    for(let i = 0; i < 14; i++){
      let currentPick = 1;
      this.draftResults.push([]);
      
      if(i % 2 === 0) {
        for(let j = 0; j < teams.length; j++){
        
          let pick = {
            pickNumber: currentPick,
            overallPick,
            round: currentRound,
            team: teams[j].team_name,
            pick: {}
          };
          this.draftResults[i].push(pick);
          currentPick += 1;
          overallPick += 1;
        }
      } else {
        for(let j = teams.length - 1; j >= 0; j--) {
          let pick = {
            pickNumber: currentPick,
            overallPick,
            round: currentRound,
            team: teams[j].team_name,
            pick: {}
          };
          this.draftResults[i].push(pick);
          currentPick += 1;
          overallPick += 1;
        }
      }

      currentRound += 1;
    }

    return this.draftResults;
  }
}
